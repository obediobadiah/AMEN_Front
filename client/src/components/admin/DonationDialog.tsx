"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Donation } from "@/hooks/use-donations";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loader2, DollarSign, User, Mail, CreditCard, Activity } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const donationSchema = zod.object({
    donor: zod.string().min(2, "Donor name is required"),
    email: zod.string().email("Invalid email address"),
    amount: zod.number().positive("Amount must be positive"),
    currency: zod.string().default("USD"),
    frequency: zod.string().default("oneTime"),
    method: zod.string().default("card"),
    status: zod.string().default("completed"),
});

interface DonationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<void>;
    donation?: Donation | null;
    isSubmitting: boolean;
}

export function DonationDialog({ open, onOpenChange, onSubmit, donation, isSubmitting }: DonationDialogProps) {
    const t = useTranslations("admin.donations.dialog");
    const tCommon = useTranslations("admin.common");
    const tDon = useTranslations("admin.donations");

    const form = useForm({
        resolver: zodResolver(donationSchema),
        defaultValues: {
            donor: "",
            email: "",
            amount: 0,
            currency: "USD",
            frequency: "oneTime",
            method: "card",
            status: "completed",
        },
    });

    useEffect(() => {
        if (donation) {
            form.reset({
                donor: donation.donor,
                email: donation.email,
                amount: donation.amount,
                currency: donation.currency,
                frequency: donation.frequency,
                method: donation.method,
                status: donation.status,
            });
        } else {
            form.reset({
                donor: "",
                email: "",
                amount: 0,
                currency: "USD",
                frequency: "oneTime",
                method: "card",
                status: "completed",
            });
        }
    }, [donation, form, open]);

    const handleFormSubmit = async (data: any) => {
        await onSubmit(data);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 selection:bg-primary selection:text-white">
                <div className="bg-slate-50/80 backdrop-blur-md p-10 border-b border-slate-100 sticky top-0 z-10">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tight">
                            {donation ? t("editTitle") : t("createTitle")}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-lg mt-3 max-w-xl">
                            {donation ? t("editDesc") : t("createDesc")}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="donor"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1 flex items-center gap-2">
                                                <User size={12} /> {t("donorLabel")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder={t("donorPlaceholder")} className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8 text-lg focus-visible:ring-primary/20 transition-all placeholder:text-slate-300" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs font-bold text-rose-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1 flex items-center gap-2">
                                                <Mail size={12} /> {t("emailLabel")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder={t("emailPlaceholder")} className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8 focus-visible:ring-primary/20 transition-all placeholder:text-slate-300" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs font-bold text-rose-500" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1 flex items-center gap-2">
                                                <DollarSign size={12} /> {t("amountLabel")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8 text-2xl focus-visible:ring-primary/20 transition-all text-emerald-600"
                                                    {...field}
                                                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs font-bold text-rose-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="currency"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("currencyLabel")}</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-16 rounded-2xl bg-white border-slate-100 font-bold px-8 shadow-sm">
                                                        <SelectValue placeholder="USD" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                    <SelectItem value="USD" className="rounded-xl font-bold py-3">USD ($)</SelectItem>
                                                    <SelectItem value="EUR" className="rounded-xl font-bold py-3">EUR (€)</SelectItem>
                                                    <SelectItem value="CDF" className="rounded-xl font-bold py-3">CDF (FC)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <FormField
                                    control={form.control}
                                    name="frequency"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1 flex items-center gap-2">
                                                <Activity size={12} /> {t("frequencyLabel")}
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 font-bold shadow-sm">
                                                        <SelectValue placeholder="Frequency" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                    <SelectItem value="oneTime" className="rounded-xl font-bold py-3">{tDon("filters.one-time")}</SelectItem>
                                                    <SelectItem value="monthly" className="rounded-xl font-bold py-3">{tDon("filters.monthly")}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="method"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1 flex items-center gap-2">
                                                <CreditCard size={12} /> {t("methodLabel")}
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 font-bold shadow-sm">
                                                        <SelectValue placeholder="Method" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                    <SelectItem value="card" className="rounded-xl font-bold py-3">Credit Card</SelectItem>
                                                    <SelectItem value="mobile" className="rounded-xl font-bold py-3">Mobile Money</SelectItem>
                                                    <SelectItem value="bank" className="rounded-xl font-bold py-3">Bank Transfer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1 flex items-center gap-2">
                                                <Activity size={12} /> {t("statusLabel")}
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 font-bold shadow-sm">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                    <SelectItem value="completed" className="rounded-xl font-bold py-3">Completed</SelectItem>
                                                    <SelectItem value="pending" className="rounded-xl font-bold py-3">Pending</SelectItem>
                                                    <SelectItem value="failed" className="rounded-xl font-bold py-3">Failed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter className="pt-10 border-t border-slate-50 mt-10">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                    className="h-16 px-10 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 hover:text-slate-600 transition-all"
                                >
                                    {tCommon("cancel")}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-16 px-14 rounded-2xl bg-primary shadow-2xl shadow-primary/30 hover:shadow-primary/50 font-black text-lg transition-all min-w-[220px]"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span className="animate-pulse italic">Processing...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            {donation ? t("update") : t("save")}
                                        </div>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
