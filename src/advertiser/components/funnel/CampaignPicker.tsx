/**
 * Koko campaign weeks.
 *
 * One campaign per booking, so opening one hides the rest and replaces the grid
 * with its fixed-date picker: the choice in front of the advertiser is "which
 * days of this campaign", not "which of ten campaigns, also which days".
 * Removing it brings the grid back.
 */
import { AlertCircle, Check } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  campaignDayLabel,
  CAMPAIGN_PERIODS,
  findCampaign,
  FULL_PERIOD_DISCOUNT,
} from "../../domain/campaigns";
import { compact, days as daysLabel, money, percent } from "../../domain/format";
import { campaignDayRate, viewsPerDay } from "../../domain/pricing";
import type { BookingDraft, CampaignPeriod } from "../../domain/types";
import { campaignDaysTaken } from "../../state/booking-draft";
import { Collapse } from "../primitives";

/** How many campaign cards are shown before "see more". */
const PAGE = 6;

export function CampaignPicker({
  draft,
  onSelect,
  onClear,
}: {
  draft: BookingDraft;
  onSelect: (campaign: CampaignPeriod, days: number, full: boolean) => void;
  onClear: () => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [from, setFrom] = useState<number | null>(null);
  const [to, setTo] = useState<number | null>(null);
  const [visible, setVisible] = useState(PAGE);

  const chosen = draft.campaigns[0];
  const active = findCampaign(openId ?? chosen?.id ?? "");
  const cards = active ? [active] : CAMPAIGN_PERIODS.slice(0, visible);

  const open = (campaign: CampaignPeriod) => {
    setOpenId(campaign.id);
    setFrom(null);
    setTo(null);
  };

  const clear = () => {
    setOpenId(null);
    setFrom(null);
    setTo(null);
    onClear();
  };

  const pickChip = (index: number) => {
    if (from === null || to !== null || index < from) {
      setFrom(index);
      setTo(null);
      return;
    }
    setTo(index);
  };

  const vpd = viewsPerDay(draft.placementIds, draft.positions);

  return (
    <section className="animate-in fade-in slide-in-from-top-2 rounded-[18px] border border-border/60 bg-card p-6 duration-300 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h2 className="text-[19px] font-bold tracking-tight">Pick a campaign week</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            The year's biggest audiences. One campaign per booking.
          </p>
        </div>
        <span className="whitespace-nowrap pb-1 text-xs font-semibold text-muted-foreground">
          First come, first served
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {cards.map((campaign) => {
          const added = draft.campaigns.find((c) => c.id === campaign.id);
          const periodViews = vpd * campaign.periodDays * campaign.multiple;
          return (
            <div
              key={campaign.id}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-[14px] border-[1.5px] bg-card text-left transition-colors duration-150",
                added || openId === campaign.id
                  ? "border-gray-900 dark:border-gray-200"
                  : "border-border hover:border-gray-400",
              )}
            >
              <span
                className="flex h-12 items-center px-4"
                style={{ background: campaign.band, color: campaign.ink }}
              >
                <span className="text-sm font-bold leading-tight">{campaign.name}</span>
              </span>
              <div className="flex flex-1 flex-col px-4 py-3.5">
                <span className="text-xs font-bold tabular-nums">{campaign.dates}</span>
                <span className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold leading-none tracking-tight tabular-nums">
                    {campaign.multiple}×
                  </span>
                  <span className="text-xs text-muted-foreground">normal traffic</span>
                </span>
                <span className="mt-1.5 block text-xs text-foreground/80">
                  Up to <span className="font-bold tabular-nums">{compact(periodViews)}</span> views
                  over the period · guaranteed slot
                </span>
                <span
                  className={cn(
                    "mt-1.5 block text-[11px]",
                    campaign.earlyBird
                      ? "font-bold text-amber-700 dark:text-amber-400"
                      : "text-muted-foreground",
                  )}
                >
                  {added
                    ? added.full
                      ? `Selected · full period · saved ${percent(FULL_PERIOD_DISCOUNT)}`
                      : `Selected · ${added.days} of ${campaign.periodDays} days`
                    : campaign.note}
                </span>
                <button
                  type="button"
                  onClick={() => (active ? clear() : open(campaign))}
                  className={cn(
                    "mt-3 self-start whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-colors",
                    active
                      ? "border-[1.5px] border-gray-900 bg-card text-foreground hover:bg-muted/40 dark:border-gray-200"
                      : "bg-gray-900 text-white shadow-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200",
                  )}
                >
                  {active ? "Unselect" : "Select"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!active && CAMPAIGN_PERIODS.length > PAGE && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible(visible < CAMPAIGN_PERIODS.length ? visible + PAGE : PAGE)}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200"
          >
            {visible < CAMPAIGN_PERIODS.length
              ? `See more campaign weeks (${CAMPAIGN_PERIODS.length - visible})`
              : "See fewer campaign weeks"}
          </button>
        </div>
      )}

      <Collapse open={Boolean(openId && active)}>
        {active && (
          <CampaignDayPicker
            campaign={active}
            draft={draft}
            from={from}
            to={to}
            onPickChip={pickChip}
            onAdd={onSelect}
          />
        )}
      </Collapse>

      {chosen && <SelectedCampaign campaignId={chosen.id} draft={draft} onRemove={clear} />}
    </section>
  );
}

function CampaignDayPicker({
  campaign,
  draft,
  from,
  to,
  onPickChip,
  onAdd,
}: {
  campaign: CampaignPeriod;
  draft: BookingDraft;
  from: number | null;
  to: number | null;
  onPickChip: (index: number) => void;
  onAdd: (campaign: CampaignPeriod, days: number, full: boolean) => void;
}) {
  const taken = campaignDaysTaken(campaign.id, from, to);
  const perDay = campaignDayRate(draft.placementIds, draft.positions, campaign.multiple);
  const fullGross = perDay * campaign.periodDays;
  const fullPrice = Math.round(fullGross * (1 - FULL_PERIOD_DISCOUNT));
  const partial = taken > 0 && taken < campaign.periodDays;

  return (
    <div className="mt-4 rounded-[14px] border border-border/60 bg-muted/20 p-5">
      <p className="text-sm font-bold">
        {campaign.name}. Fixed dates, {campaign.dates}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Tap your days, or book the full period and save {percent(FULL_PERIOD_DISCOUNT)}.
      </p>

      <div className="mt-3">
        {taken === 0 ? (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold leading-none text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
            <AlertCircle aria-hidden="true" className="h-3 w-3" />
            0/{campaign.periodDays} days selected. Tap the dates below
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold leading-none text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Check aria-hidden="true" className="h-3 w-3 stroke-[3]" />
            {taken}/{campaign.periodDays} days selected
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {Array.from({ length: campaign.periodDays }, (_, index) => {
          const label = campaignDayLabel(campaign, index);
          const inRange =
            from !== null && (to !== null ? index >= from && index <= to : index === from);
          return (
            <button
              key={index}
              type="button"
              onClick={() => onPickChip(index)}
              aria-pressed={inRange}
              aria-label={`${label.day} ${label.month}`}
              className={cn(
                "w-11 rounded-lg border-[1.5px] px-0 py-2 text-center transition-colors duration-150",
                inRange
                  ? "border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
                  : "border-border bg-card hover:border-gray-900 dark:hover:border-gray-200",
              )}
            >
              <span className="block text-sm font-bold tabular-nums">{label.day}</span>
              <span
                className={cn(
                  "block text-[9px] font-semibold",
                  inRange ? "opacity-70" : "text-muted-foreground",
                )}
              >
                {label.month}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {partial && (
          <button
            type="button"
            onClick={() => onAdd(campaign, taken, false)}
            className="rounded-lg border-[1.5px] border-gray-900 px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-900 hover:text-white dark:border-gray-200 dark:hover:bg-gray-200 dark:hover:text-gray-900"
          >
            Add {daysLabel(taken)} · {money(perDay * taken)}
          </button>
        )}
        <button
          type="button"
          onClick={() => onAdd(campaign, campaign.periodDays, true)}
          className="w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md active:scale-[0.98] sm:w-auto dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Book full period ·{" "}
          <span className="line-through opacity-60 tabular-nums">{money(fullGross)}</span>{" "}
          <span className="font-bold tabular-nums">{money(fullPrice)}</span>
          <span className="ml-2 rounded-full bg-emerald-500 px-2.5 py-1 align-middle text-[11px] font-bold text-white">
            Save {percent(FULL_PERIOD_DISCOUNT)}
          </span>
        </button>
      </div>

      {partial && (
        <p className="mt-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          The full period saves you {money(fullGross - fullPrice)}.
        </p>
      )}
    </div>
  );
}

function SelectedCampaign({
  campaignId,
  draft,
  onRemove,
}: {
  campaignId: string;
  draft: BookingDraft;
  onRemove: () => void;
}) {
  const campaign = findCampaign(campaignId);
  const selection = draft.campaigns.find((c) => c.id === campaignId);
  if (!campaign || !selection) return null;

  const perDay = campaignDayRate(draft.placementIds, draft.positions, campaign.multiple);
  const gross = perDay * (selection.full ? campaign.periodDays : selection.days);
  const price = selection.full ? Math.round(gross * (1 - FULL_PERIOD_DISCOUNT)) : gross;

  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 dark:border-emerald-800 dark:bg-emerald-950/30">
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600"
        >
          <Check className="h-3.5 w-3.5 stroke-[3] text-white" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
            Currently selected: {campaign.name}
          </p>
          <p className="text-xs text-emerald-700 tabular-nums dark:text-emerald-400">
            {selection.full
              ? `Full period, ${daysLabel(campaign.periodDays)}`
              : `${selection.days} of ${campaign.periodDays} days`}{" "}
            ·{" "}
            {selection.full && <span className="mr-1 line-through opacity-60">{money(gross)}</span>}
            <span className="font-bold">{money(price)}</span>
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 rounded-lg border border-emerald-300 px-4 py-2 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
      >
        Remove
      </button>
    </div>
  );
}
