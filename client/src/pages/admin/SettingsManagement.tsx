"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Shield, Bell, Save } from "lucide-react";

export default function SettingsManagement() {
    const t = useTranslations("admin.settings");

    return (
        <AdminLayout>
            <div className="space-y-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t("title")}</h2>
                    <p className="text-slate-500 mt-1 font-medium">{t("description")}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                                <Input defaultValue="AMEN NGO" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">{t("main.email")}</Label>
                                <Input defaultValue="contact@amen-ngo.org" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold" />
                            </div>
                            <Button className="w-full h-12 rounded-xl bg-primary font-bold gap-2">
                                <Save size={18} /> {t("main.updateBtn")}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="p-10 pb-6 border-b border-slate-50">
                            <div className="flex items-center gap-3 mb-2">
                                <Shield size={20} className="text-primary" />
                                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t("security.title")}</CardTitle>
                            </div>
                            <CardDescription className="text-slate-400 font-medium">{t("security.description")}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <div>
                                    <p className="text-sm font-black text-slate-700">{t("security.twoFactor")}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t("security.status")}: {t("security.disabled")}</p>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-lg h-9 px-4 font-black text-[10px] uppercase tracking-widest">{t("security.enableBtn")}</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <div>
                                    <p className="text-sm font-black text-slate-700">{t("security.logging")}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t("security.status")}: {t("security.active")}</p>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-lg h-9 px-4 font-black text-[10px] uppercase tracking-widest">{t("security.viewLogsBtn")}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
