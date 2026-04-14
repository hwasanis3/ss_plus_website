import { Card } from "../ui/Card";

export default function NotreEquipe() {
  return (
    <div className="p-4 lg:p-8 animate-in flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-3xl w-full p-8 lg:p-10 text-center border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-slate-50 dark:to-slate-950">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] bg-amber-500/15 text-amber-500 border border-amber-500/20 px-4 py-1.5 rounded-full mb-4">
          Coming Soon
        </span>
        <h2 className="font-display text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          👷 Nos Techniciens Certifies
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
          Bientot, vous pourrez consulter les profils complets de l&apos;equipe SS Plus, noter les interventions, et demander un technicien prefere pour vos missions planifiees.
        </p>
      </Card>
    </div>
  );
}
