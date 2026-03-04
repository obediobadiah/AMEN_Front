"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { useTranslations } from "next-intl";
import { useState, useMemo, useRef, useEffect } from "react";
import { usePortalUsers, CreateUserPayload, UpdateUserPayload, PortalUser } from "@/hooks/use-portal-users";
import { useGovernance } from "@/hooks/use-governance";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AdminEntityList } from "@/components/AdminEntityList";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Users, Loader2, Eye, EyeOff, ChevronDown, Check, UserCheck } from "lucide-react";

// ── Governance Name Combobox ─────────────────────────────────────────────────
interface NameComboboxProps {
    value: string;
    onChange: (name: string) => void;
    suggestions: string[];
    placeholder?: string;
    disabled?: boolean;
}

function NameCombobox({ value, onChange, suggestions, placeholder, disabled }: NameComboboxProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(value);
    const ref = useRef<HTMLDivElement>(null);

    // Sync external value → local query when dialog resets
    useEffect(() => { setQuery(value); }, [value]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = useMemo(() =>
        suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase())).slice(0, 8),
        [suggestions, query]
    );

    const handleInput = (val: string) => {
        setQuery(val);
        onChange(val);
        setOpen(true);
    };

    const handleSelect = (name: string) => {
        setQuery(name);
        onChange(name);
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            <div className="relative">
                <Input
                    id="user-form-name"
                    value={query}
                    onChange={(e) => handleInput(e.target.value)}
                    onFocus={() => setOpen(true)}
                    placeholder={placeholder}
                    className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold pr-10"
                    disabled={disabled}
                    autoComplete="off"
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setOpen((o) => !o)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 pointer-events-auto"
                    disabled={disabled}
                >
                    <ChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} />
                </button>
            </div>

            {/* Dropdown */}
            {open && filtered.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden">
                    <div className="p-1.5 space-y-0.5 max-h-52 overflow-y-auto">
                        {filtered.map((name) => (
                            <button
                                key={name}
                                type="button"
                                onMouseDown={(e) => { e.preventDefault(); handleSelect(name); }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-colors",
                                    name === query
                                        ? "bg-primary/5 text-primary"
                                        : "text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <UserCheck size={14} className={name === query ? "text-primary" : "text-slate-400"} />
                                {name}
                                {name === query && <Check size={12} className="ml-auto text-primary" />}
                            </button>
                        ))}
                    </div>
                    <div className="px-3 py-2 border-t border-slate-50">
                        <p className="text-[10px] text-slate-400 font-medium">
                            Governance members · you can also type any name
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function UsersManagement() {
    const t = useTranslations("admin.users");
    const tCommon = useTranslations("admin.common");
    const { user: currentUser } = useAuth();

    const { users, isLoading, createUser, updateUser, deleteUser, isCreating, isUpdating, checkEmailExists } = usePortalUsers();
    const { members: governanceMembers } = useGovernance();

    const governanceNames = useMemo(
        () => {
            console.log("Governance members raw:", governanceMembers);
            return governanceMembers.map((m) => m.name).filter(Boolean);
        },
        [governanceMembers]
    );

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<PortalUser | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Form state
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formPassword, setFormPassword] = useState("");
    const [formRole, setFormRole] = useState<"admin" | "staff">("staff");
    const [formActive, setFormActive] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");

    const openAddDialog = () => {
        setSelectedUser(null);
        setFormName(""); setFormEmail(""); setFormPassword(""); setFormRole("staff"); setFormActive(true);
        setEmailError("");
        setIsDialogOpen(true);
    };

    const openEditDialog = (u: PortalUser) => {
        setSelectedUser(u);
        setFormName(u.name); setFormEmail(u.email); setFormPassword(""); setFormRole(u.role as any); setFormActive(u.is_active);
        setEmailError("");
        setIsDialogOpen(true);
    };

    // Email validation function
    const validateEmail = (email: string) => {
        if (!email.trim()) {
            setEmailError("");
            return;
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }

        // Check if email already exists
        const emailExists = checkEmailExists(email, selectedUser?.id);
        if (emailExists) {
            setEmailError("A user with this email already exists");
        } else {
            setEmailError("");
        }
    };

    // Handle email change with validation
    const handleEmailChange = (email: string) => {
        setFormEmail(email);
        validateEmail(email);
    };

    const handleDelete = async (u: PortalUser) => {
        if (u.id === currentUser?.id) { toast.error(t("messages.cannotDeleteSelf")); return; }
        if (confirm(t("messages.deleteConfirm"))) {
            try {
                await deleteUser(u.id);
                toast.success(t("messages.deleteSuccess"));
            } catch (err: any) {
                toast.error(err.message || t("messages.error"));
            }
        }
    };

    const handleSubmit = async () => {
        if (!formName.trim()) { toast.error(t("dialog.nameRequired") || "Name is required"); return; }
        if (!formEmail.trim()) { toast.error(t("dialog.emailRequired") || "Email is required"); return; }
        
        // Validate email format and existence
        validateEmail(formEmail);
        if (emailError) {
            toast.error(emailError);
            return;
        }
        
        try {
            if (selectedUser) {
                const data: UpdateUserPayload = { name: formName, email: formEmail, role: formRole, is_active: formActive };
                if (formPassword) data.password = formPassword;
                await updateUser({ id: selectedUser.id, data });
                toast.success(t("messages.updateSuccess"));
            } else {
                if (!formPassword) { toast.error(t("messages.passwordRequired")); return; }
                const data: CreateUserPayload = { name: formName, email: formEmail, password: formPassword, role: formRole };
                await createUser(data);
                toast.success(t("messages.createSuccess"));
            }
            setIsDialogOpen(false);
        } catch (err: any) {
            toast.error(err.message || t("messages.error"));
        }
    };

    const filteredItems = useMemo(() => {
        let result = users.filter((u) => {
            const matchesSearch =
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter =
                filter === "all" ||
                (filter === "admin" && u.role === "admin") ||
                (filter === "staff" && u.role === "staff") ||
                (filter === "active" && u.is_active) ||
                (filter === "inactive" && !u.is_active);
            return matchesSearch && matchesFilter;
        });
        result.sort((a, b) => {
            if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sort === "name") return a.name.localeCompare(b.name);
            return 0;
        });
        return result;
    }, [users, searchQuery, filter, sort]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage]);

    const columns = [
        {
            key: "name",
            label: t("columns.name"),
            render: (u: PortalUser) => {
                const initials = u.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
                return (
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-slate-100">
                            <AvatarFallback className={cn("font-black text-xs", u.role === "admin" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500")}>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 text-sm">{u.name}</span>
                                {u.id === currentUser?.id && (
                                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/30 text-primary">{t("columns.you")}</Badge>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium">{u.email}</p>
                        </div>
                    </div>
                );
            }
        },
        {
            key: "role",
            label: t("columns.role"),
            render: (u: PortalUser) => (
                <Badge variant="outline" className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit",
                    u.role === "admin" ? "bg-primary/5 text-primary border-primary/20" : "bg-slate-50 text-slate-500 border-slate-200"
                )}>
                    {u.role === "admin" ? <ShieldCheck size={10} /> : <Users size={10} />}
                    {t(`roles.${u.role}`)}
                </Badge>
            )
        },
        {
            key: "is_active",
            label: t("columns.status"),
            render: (u: PortalUser) => (
                <span className={cn(
                    "inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                    u.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", u.is_active ? "bg-green-500 animate-pulse" : "bg-red-400")} />
                    {u.is_active ? t("status.active") : t("status.inactive")}
                </span>
            )
        },
        {
            key: "last_login",
            label: t("columns.lastLogin"),
            render: (u: PortalUser) => (
                <span className="text-xs text-slate-400 font-medium">
                    {u.last_login ? new Date(u.last_login).toLocaleDateString() : t("columns.never")}
                </span>
            )
        },
    ];

    const filterContent = (
        <>
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {tCommon("filters")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2 bg-slate-100" />
            {["all", "admin", "staff", "active", "inactive"].map((f) => (
                <DropdownMenuItem
                    key={f}
                    onClick={() => { setFilter(f); setCurrentPage(1); }}
                    className={cn("rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm transition-colors",
                        filter === f ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50")}
                >
                    {t(`filters.${f}`)}
                </DropdownMenuItem>
            ))}
        </>
    );

    const sortContent = (
        <>
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {tCommon("sort")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2 bg-slate-100" />
            {["newest", "oldest", "name"].map((s) => (
                <DropdownMenuItem
                    key={s}
                    onClick={() => setSort(s)}
                    className={cn("rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm transition-colors",
                        sort === s ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50")}
                >
                    {t(`sort.${s}`)}
                </DropdownMenuItem>
            ))}
        </>
    );

    const renderCard = (u: PortalUser) => {
        const initials = u.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
        return (
            <div className="flex flex-col items-center text-center space-y-4 pt-4">
                <Avatar className="h-20 w-20 border-4 border-slate-50 shadow-xl">
                    <AvatarFallback className={cn("text-2xl font-black", u.role === "admin" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500")}>
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-black text-slate-900 text-lg">{u.name}</h3>
                    <p className="text-xs text-slate-400">{u.email}</p>
                </div>
                <Badge variant="outline" className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                    u.role === "admin" ? "bg-primary/5 text-primary border-primary/20" : "bg-slate-50 text-slate-500 border-slate-200"
                )}>
                    {u.role === "admin" ? <ShieldCheck size={10} /> : <Users size={10} />}
                    {t(`roles.${u.role}`)}
                </Badge>
            </div>
        );
    };

    return (
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <AdminEntityList
                    title={t("title")}
                    description={t("description")}
                    items={paginatedItems}
                    columns={columns}
                    onAdd={openAddDialog}
                    onEdit={openEditDialog}
                    onDelete={handleDelete}
                    filterContent={filterContent}
                    sortContent={sortContent}
                    searchValue={searchQuery}
                    onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    searchPlaceholder={t("searchPlaceholder")}
                    renderCard={renderCard}
                    defaultView="table"
                />
            </div>

            {/* Create / Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg rounded-[2rem] border-none shadow-2xl">
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-2xl font-black text-slate-900">
                            {selectedUser ? t("dialog.editTitle") : t("dialog.createTitle")}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">
                            {selectedUser ? t("dialog.editDesc") : t("dialog.createDesc")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {/* Full Name — combobox with governance members */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                {t("dialog.nameLabel")}
                                {governanceNames.length > 0 && (
                                    <span className="ml-2 normal-case font-medium text-slate-300 tracking-normal">
                                        ({governanceNames.length} governance member{governanceNames.length !== 1 ? "s" : ""})
                                    </span>
                                )}
                            </Label>
                            <NameCombobox
                                value={formName}
                                onChange={setFormName}
                                suggestions={governanceNames}
                                placeholder={t("dialog.namePlaceholder")}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">{t("dialog.emailLabel")}</Label>
                            <Input
                                id="user-form-email"
                                type="email"
                                value={formEmail}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                placeholder="user@amen-ngo.org"
                                className={cn(
                                    "h-12 rounded-xl bg-slate-50 border-slate-100 font-bold",
                                    emailError && "border-red-300 bg-red-50"
                                )}
                            />
                            {emailError && (
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                    {emailError}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                {selectedUser ? t("dialog.passwordOptionalLabel") : t("dialog.passwordLabel")}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="user-form-password"
                                    type={showPassword ? "text" : "password"}
                                    value={formPassword}
                                    onChange={(e) => setFormPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">{t("dialog.roleLabel")}</Label>
                            <Select value={formRole} onValueChange={(v) => setFormRole(v as any)}>
                                <SelectTrigger id="user-form-role" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    <SelectItem value="staff" className="font-bold rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="text-slate-500" />
                                            {t("roles.staff")} — {t("dialog.staffDesc")}
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="admin" className="font-bold rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-primary" />
                                            {t("roles.admin")} — {t("dialog.adminDesc")}
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Active toggle (edit only) */}
                        {selectedUser && (
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <div>
                                    <p className="text-sm font-black text-slate-700">{t("dialog.activeLabel")}</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{t("dialog.activeDesc")}</p>
                                </div>
                                <Switch
                                    id="user-form-active"
                                    checked={formActive}
                                    onCheckedChange={setFormActive}
                                    className="data-[state=checked]:bg-green-500"
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-4 gap-3">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-12 font-bold">
                            {tCommon("cancel")}
                        </Button>
                        <Button
                            id="user-form-submit"
                            onClick={handleSubmit}
                            disabled={isCreating || isUpdating}
                            className="rounded-xl h-12 bg-primary font-bold gap-2"
                        >
                            {(isCreating || isUpdating) ? (
                                <><Loader2 size={16} className="animate-spin" /> {tCommon("saving")}</>
                            ) : (
                                selectedUser ? t("dialog.update") : t("dialog.save")
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
