import { Pipette } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  TOPIC_COLOR_PRESETS,
  isValidHexColor,
  normalizeHexColor,
  withAlpha,
} from "@/shared/lib/color";
import { cn } from "@/lib/utils";

interface TopicColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function TopicColorPicker({ color, onChange }: TopicColorPickerProps) {
  const [open, setOpen] = useState(false);
  const normalizedColor = isValidHexColor(color)
    ? normalizeHexColor(color)
    : "#0EA5E9";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="topic-color">Topic color</Label>
        <div className="rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground">
          {normalizedColor}
        </div>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="group flex w-full items-center gap-3 rounded-xl border bg-background px-3 py-3 text-left transition hover:border-primary/40 hover:bg-accent/40"
          >
            <div
              className="h-10 w-10 rounded-lg border shadow-sm"
              style={{
                backgroundColor: normalizedColor,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), 0 10px 30px ${withAlpha(normalizedColor, 0.25)}`,
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Choose topic color</p>
              <p className="text-xs text-muted-foreground">
                Click to open the color picker and set a hex value.
              </p>
            </div>
            <Pipette className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-[320px] space-y-4 rounded-2xl p-4"
        >
          <div className="space-y-3">
            <div
              className="rounded-2xl border p-3"
              style={{
                background: `linear-gradient(135deg, ${withAlpha(normalizedColor, 0.2)}, rgba(255,255,255,0.9))`,
              }}
            >
              <HexColorPicker
                color={normalizedColor}
                onChange={(nextColor) => onChange(normalizeHexColor(nextColor))}
                className="!w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic-color">Hex color</Label>
              <Input
                id="topic-color"
                value={color}
                onChange={(event) => onChange(event.target.value.toUpperCase())}
                placeholder="#0EA5E9"
                className={cn(
                  !isValidHexColor(color) &&
                    "border-red-300 focus-visible:ring-red-300",
                )}
              />
              {!isValidHexColor(color) && (
                <p className="text-xs text-red-600">
                  Use a valid 6-digit hexadecimal color.
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Presets</Label>
            <div className="grid grid-cols-4 gap-2">
              {TOPIC_COLOR_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  aria-label={`Use color ${preset}`}
                  className={cn(
                    "h-10 rounded-xl border transition hover:scale-[1.03]",
                    normalizeHexColor(color) === preset &&
                      "ring-2 ring-foreground ring-offset-2",
                  )}
                  style={{ backgroundColor: preset }}
                  onClick={() => onChange(preset)}
                />
              ))}
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => {
              onChange(normalizedColor);
              setOpen(false);
            }}
          >
            Keep this color
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
