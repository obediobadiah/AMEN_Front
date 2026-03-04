"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Globe, Shield, Bell, Save, Loader2, CheckCircle,
    AlertCircle, RefreshCw, Lock, Activity, Moon
} from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsManagement() {
    const t = useTranslations("admin.settings");
    const { settings, isLoading, updateSettings, isUpdating } = useSettings();
    const { isAdmin } = useAuth();

    // Controlled form state (mirrors backend)
    const [orgName, setOrgName] = useState("");
    const [primaryEmail, setPrimaryEmail] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [twoFactor, setTwoFactor] = useState(false);
    const [activityLogging, setActivityLogging] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Populate form when settings load
    useEffect(() => {
        if (settings) {
            setOrgName(settings.org_name);
            setPrimaryEmail(settings.primary_email);
            setWebsiteUrl(settings.website_url);
            setTwoFactor(settings.two_factor_enabled);
            setActivityLogging(settings.activity_logging_enabled);
            setMaintenanceMode(settings.maintenance_mode);
            setIsDirty(false);
        }
    }, [settings]);

    const markDirty = () => setIsDirty(true);

    const handleSaveMain = async () => {
        if (!isAdmin) return;
        try {
            await updateSettings({ org_name: orgName, primary_email: primaryEmail, website_url: websiteUrl });
            setIsDirty(false);
            toast.success(t("messages.saveSuccess"));
        } catch (err: any) {
            toast.error(err.message || t("messages.error"));
        }
    };

    const handleToggle2FA = async () => {
        if (!isAdmin) return;
        const newVal = !twoFactor;
        setTwoFactor(newVal);
        try {
            await updateSettings({ two_factor_enabled: newVal });
            toast.success(newVal ? t("security.enabledMsg") : t("security.disabledMsg"));
        } catch (err: any) {
            setTwoFactor(!newVal); // revert
            toast.error(err.message || t("messages.error"));
        }
    };

    const handleToggleLogging = async () => {
        if (!isAdmin) return;
        const newVal = !activityLogging;
        setActivityLogging(newVal);
        try {
            await updateSettings({ activity_logging_enabled: newVal });
            toast.success(newVal ? t("security.loggingEnabledMsg") : t("security.loggingDisabledMsg"));
        } catch (err: any) {
            setActivityLogging(!newVal);
            toast.error(err.message || t("messages.error"));
        }
    };

    const handleToggleMaintenance = async () => {
        if (!isAdmin) return;
        const newVal = !maintenanceMode;
        setMaintenanceMode(newVal);
        try {
            await updateSettings({ maintenance_mode: newVal });
            toast.success(newVal ? t("maintenance.enabledMsg") : t("maintenance.disabledMsg"));
        } catch (err: any) {
            setMaintenanceMode(!newVal);
            toast.error(err.message || t("messages.error"));
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">{t("loading")}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t("title")}</h2>
                        <p className="text-slate-500 mt-1 font-medium">{t("description")}</p>
                    </div>
                    {!isAdmin && (
                        <Badge variant="outline" className="rounded-xl px-4 py-2 border-amber-200 bg-amber-50 text-amber-700 font-bold text-xs">
                            <Lock size={12} className="mr-1.5" />
                            {t("readOnlyMode")}
                        </Badge>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ── Main Configuration ── */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="p-10 pb-6 border-b border-slate-50">
                            <div className="flex items-center gap-3 mb-2">
                                <Globe size={20} className="text-primary" />
                                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t("main.title")}</CardTitle>
                            </div>
                            <CardDescription className="text-slate-400 font-medium">{t("main.description")}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">{t("main.orgName")}</Label>
                                <Input
                                    id="settings-org-name"
                                    value={orgName}
                                    onChange={(e) => { setOrgName(e.target.value); markDirty(); }}
                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold"
                                    disabled={!isAdmin || isUpdating}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">{t("main.email")}</Label>
                                <Input
                                    id="settings-primary-email"
                                    type="email"
                                    value={primaryEmail}
                                    onChange={(e) => { setPrimaryEmail(e.target.value); markDirty(); }}
                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold"
                                    disabled={!isAdmin || isUpdating}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">{t("main.websiteUrl")}</Label>
                                <Input
                                    id="settings-website-url"
                                    value={websiteUrl}
                                    onChange={(e) => { setWebsiteUrl(e.target.value); markDirty(); }}
                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold"
                                    disabled={!isAdmin || isUpdating}
                                />
                            </div>
                            {isAdmin && (
                                <Button
                                    id="settings-save-main"
                                    onClick={handleSaveMain}
                                    disabled={isUpdating || !isDirty}
                                    className={cn(
                                        "w-full h-12 rounded-xl font-bold gap-2 transition-all",
                                        isDirty ? "bg-primary hover:bg-primary/90" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    )}
                                >
                                    {isUpdating ? (
                                        <><Loader2 size={18} className="animate-spin" /> {t("main.saving")}</>
                                    ) : (
                                        <><Save size={18} /> {t("main.updateBtn")}</>
                                    )}
                                </Button>
                            )}
                            {settings?.updated_at && (
                                <p className="text-[10px] text-slate-400 font-medium text-center">
                                    {t("main.lastUpdated")}: {new Date(settings.updated_at).toLocaleString()}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* ── Security Settings ── */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="p-10 pb-6 border-b border-slate-50">
                            <div className="flex items-center gap-3 mb-2">
                                <Shield size={20} className="text-primary" />
                                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t("security.title")}</CardTitle>
                            </div>
                            <CardDescription className="text-slate-400 font-medium">{t("security.description")}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 space-y-4">
                            {/* Two-Factor Auth */}
                            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100/80 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Lock size={18} className={cn("shrink-0", twoFactor ? "text-green-500" : "text-slate-400")} />
                                    <div>
                                        <p className="text-sm font-black text-slate-700">{t("security.twoFactor")}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                            {t("security.status")}: <span className={twoFactor ? "text-green-500" : "text-slate-400"}>
                                                {twoFactor ? t("security.enabled") : t("security.disabled")}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    id="settings-2fa"
                                    checked={twoFactor}
                                    onCheckedChange={handleToggle2FA}
                                    disabled={!isAdmin || isUpdating}
                                    className="data-[state=checked]:bg-green-500"
                                />
                            </div>

                            {/* Activity Logging */}
                            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100/80 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Activity size={18} className={cn("shrink-0", activityLogging ? "text-primary" : "text-slate-400")} />
                                    <div>
                                        <p className="text-sm font-black text-slate-700">{t("security.logging")}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                            {t("security.status")}: <span className={activityLogging ? "text-primary" : "text-slate-400"}>
                                                {activityLogging ? t("security.active") : t("security.disabled")}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    id="settings-logging"
                                    checked={activityLogging}
                                    onCheckedChange={handleToggleLogging}
                                    disabled={!isAdmin || isUpdating}
                                />
                            </div>

                            {/* Maintenance Mode */}
                            <div className={cn(
                                "flex items-center justify-between p-5 rounded-2xl transition-colors",
                                maintenanceMode ? "bg-amber-50 border border-amber-200" : "bg-slate-50 hover:bg-slate-100/80"
                            )}>
                                <div className="flex items-center gap-3">
                                    <Moon size={18} className={cn("shrink-0", maintenanceMode ? "text-amber-500" : "text-slate-400")} />
                                    <div>
                                        <p className="text-sm font-black text-slate-700">{t("maintenance.title")}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                            {t("security.status")}: <span className={maintenanceMode ? "text-amber-500" : "text-slate-400"}>
                                                {maintenanceMode ? t("maintenance.active") : t("maintenance.inactive")}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    id="settings-maintenance"
                                    checked={maintenanceMode}
                                    onCheckedChange={handleToggleMaintenance}
                                    disabled={!isAdmin || isUpdating}
                                    className="data-[state=checked]:bg-amber-500"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Portal Info tile ── */}
                {/* <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="p-10 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-3 mb-2">
                            <Bell size={20} className="text-primary" />
                            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t("info.title")}</CardTitle>
                        </div>
                        <CardDescription className="text-slate-400 font-medium">{t("info.description")}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: t("info.platformVersion"), value: "2.0.0" },
                                { label: t("info.dbStatus"), value: "PostgreSQL", icon: <CheckCircle size={14} className="text-green-500" /> },
                                { label: t("info.apiStatus"), value: "FastAPI", icon: <CheckCircle size={14} className="text-green-500" /> },
                                { label: t("info.environment"), value: "Production" },
                            ].map((item, idx) => (
                                <div key={idx} className="p-5 bg-slate-50 rounded-2xl space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                                    <div className="flex items-center gap-1.5">
                                        {item.icon}
                                        <p className="text-sm font-black text-slate-900">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card> */}
            </div>
        </AdminLayout>
    );
}
