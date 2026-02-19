"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Shield, Bell, Save } from "lucide-react";

export default function SettingsManagement() {
    const t = useTranslations("admin.sidebar");

    return (
        <AdminLayout>
            <div className="space-y-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t("settings")}</h2>
                    <p className="text-slate-500 mt-1 font-medium">Configure portal-wide parameters and security protocols.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="p-10 pb-6 border-b border-slate-50">
                            <div className="flex items-center gap-3 mb-2">
                                <Globe size={20} className="text-primary" />
                                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Main Configurations</CardTitle>
                            </div>
                            <CardDescription className="text-slate-400 font-medium">Site-wide visibility and core metadata.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Organization Name</Label>
                                <Input defaultValue="AMEN NGO" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Primary Contact Email</Label>
                                <Input defaultValue="contact@amen-ngo.org" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold" />
                            </div>
                            <Button className="w-full h-12 rounded-xl bg-primary font-bold gap-2">
                                <Save size={18} /> Update Portal
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="p-10 pb-6 border-b border-slate-50">
                            <div className="flex items-center gap-3 mb-2">
                                <Shield size={20} className="text-primary" />
                                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Security Access</CardTitle>
                            </div>
                            <CardDescription className="text-slate-400 font-medium">Manage administrative protection layers.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <div>
                                    <p className="text-sm font-black text-slate-700">Two-Factor Authentication</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: Disabled</p>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-lg h-9 px-4 font-black text-[10px] uppercase tracking-widest">Enable</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <div>
                                    <p className="text-sm font-black text-slate-700">System Activity Logging</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: Active</p>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-lg h-9 px-4 font-black text-[10px] uppercase tracking-widest">View Logs</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
