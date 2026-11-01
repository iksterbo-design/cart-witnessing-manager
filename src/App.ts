import * as data from './data/mock';
import { AppShell, Card, Badge } from './components/ui';
const contacts = data.Contact as any[];

export function App(): HTMLElement {
  const root = document.createElement('div');
  root.className = 'tw-flex tw-flex-col tw-gap-4';
  const stageColor: Record<string, string> = { New: 'slate', Contacted: 'blue', FollowUp: 'amber', Closed: 'emerald' };
  const contactCards = contacts.map((c: any) =>
    '<div class="tw-border tw-border-slate-200 twrounded-lg tw-p-3 tw-bg-white tw-shadow-sm tw-hover:shadow">' +
      '<div class="tw-flex tw-items-center tw-gap-2 tw-mb-2">' +
        '<span class="tw-text-sm tw-font-semibold tw-text-slate-800 dark:tw-text-white">' + c.name + '</span>' +
        '<Badge label="' + c.stage + '" color="' + stageColor[c.stage] + '"></Badge>' +
        '<span class="tw-text-xs tw-text-slate-500">' + c.phone + '</span>' +
      '</div>' +
      '<div class="tw-flex tw-flex-wrap tw-gap-1 tw-mb-2">' + c.tags.map((t: any) => '<Badge label="' + t + '"></Badge>').join('') + '</div>' +
      '<div class="tw-text-xs tw-text-slate-500 tw-mb-2">Last contact: <span class="tw-font-medium tw-text-slate-700 dark:tw-text-white">' + c.lastContact + '</span></div>' +
      '<div class="tw-text-xs tw-text-slate-600 tw-mb-2">' + c.note + '</div>' +
      '<button class="tw-bg-slate-100 tw-text-slate-600 tw-rounded-md tw-px-2 tw-py-1 tw-text-xs">Follow up</button>' +
    '</div>').join('');
  const logHtml = contacts.map((c: any) =>
    '<div class="tw-flex tw-items-center tw-gap-2 tw-text-xs tw-text-slate-600 tw-py-1">' +
      '<span class="tw-h-2 tw-w-2 tw-rounded-full tw-bg-violet-500 tw-rounded-full"></span>' +
      '<span class="tw-font-medium tw-text-slate-800 dark:tw-text-white">' + c.name + '</span>' +
      '<span class="tw-text-slate-400 tw-ml-auto">' + c.lastContact + '</span>' +
    '</div>').join('');
  root.innerHTML = `
    <div id="clock" class="tw-text-xs tw-text-right tw-text-slate-400"></div>
    <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-4">
      <div class="lg:tw-span-2">
        <Card title="Witnessing Cart" desc="Outreach contacts & follow-ups">
          <div class="tw-flex tw-flex-wrap tw-gap-1.5 tw-mb-3">${contacts.map((s: any) => '<button class="tw-bg-white tw-border tw-border-slate-200 twrounded-md tw-px-2.5 tw-py-1 tw-text-xs tw-text-slate-600 tw-transition hover:bg-slate-50">' + s.stage + '</button>').join('')}</div>
          <div class="tw-text-xs tw-text-slate-500 tw-mb-3">${contacts.length} contacts · ${contacts.filter((c: any) => c.stage === 'FollowUp').length} follow-ups</div>
          <div class="tw-max-h-72 tw-overflow-y-auto tw-text-sm tw-space-y-2">${contactCards}</div>
        </Card>
        <Card title="Today's Reminders" desc="Prioritized follow-ups">
          <div class="tw-text-sm tw-text-slate-600 tw-mb-2 tw-max-h-24 tw-overflow-y-auto">${contacts.filter((c: any) => c.stage === 'FollowUp').map((c: any) => '· ' + c.name + ' <span class="tw-text-slate-400">(' + c.lastContact + ')</span>').join('') || 'No follow-ups this week'}</div>
          <button class="tw-w-full tw-bg-amber-500 tw-text-white tw-rounded-md tw-px-3 tw-py-1.5 tw-text-sm">Export follow-ups</button>
        </Card>
      </div>
      <div class="lg:tw-w-80">
        <Card title="Outreach Log" desc="Recent activity">
          <div class="tw-max-h-48 tw-overflow-y-auto tw-text-xs tw-text-slate-600 tw-space-y-1">${logHtml}</div>
        </Card>
        <Card title="Export" desc="Mock CSV (read-only)">
          <div class="tw-text-xs tw-font-mono tw-bg-slate-800 tw-text-slate-200 tw-rounded-md tw-p-2 tw-max-h-24 tw-overflow-y-auto tw-text-slate-400">contacts.csv · 6 rows · UTF-8</div>
          <button class="tw-w-full tw-bg-violet-500 tw-text-white tw-rounded-md tw-px-3 tw-py-1.5 tw-text-sm">Download CSV</button>
        </Card>
      </div>
    </div>
  `;
  setInterval(() => { const d = new Date(); document.getElementById('clock')!.textContent = d.toLocaleTimeString(); }, 1000);
  return root;
}
