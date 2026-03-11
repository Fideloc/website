import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { IconPalette, IconRefresh } from "@tabler/icons-react";

const DEFAULT_TOKENS = {
  primary: "#1a2b4a",
  "primary-foreground": "#ffffff",
  "brand-accent": "#e07a2f",
  "brand-accent-foreground": "#ffffff",
  background: "#f7f8fa",
  foreground: "#1e293b",
  secondary: "#eef1f5",
  "muted-foreground": "#6b7280",
  border: "#d5dbe5",
  accent: "#fdf4ed",
} as const;

type TokenKey = keyof typeof DEFAULT_TOKENS;

const TOKEN_LABELS: Record<TokenKey, string> = {
  primary: "Primaire (navy)",
  "primary-foreground": "Texte sur primaire",
  "brand-accent": "Accent (orange)",
  "brand-accent-foreground": "Texte sur accent",
  background: "Fond",
  foreground: "Texte",
  secondary: "Secondaire",
  "muted-foreground": "Texte secondaire",
  border: "Bordures",
  accent: "Hover subtle",
};

export default function ColorTweaker() {
  const [tokens, setTokens] = useState<Record<TokenKey, string>>({
    ...DEFAULT_TOKENS,
  });
  const [collapsed, setCollapsed] = useState(true);

  const updateToken = useCallback((key: TokenKey, value: string) => {
    setTokens((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Apply changes to CSS vars in real time
  useEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(tokens)) {
      root.style.setProperty(`--${key}`, value);
    }
  }, [tokens]);

  const reset = useCallback(() => {
    setTokens({ ...DEFAULT_TOKENS });
  }, []);

  if (collapsed) {
    return (
      <div className="fixed right-4 bottom-4 z-50">
        <Button
          size="icon-lg"
          variant="accent"
          onClick={() => setCollapsed(false)}
          className="shadow-lg"
        >
          <IconPalette size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 w-80">
      <Card className="shadow-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading text-sm">
              Color Tweaker
            </CardTitle>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => setCollapsed(true)}
            >
              &times;
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {(Object.keys(TOKEN_LABELS) as TokenKey[]).map((key) => (
              <div key={key} className="flex items-center gap-2">
                <label
                  className="relative shrink-0 cursor-pointer"
                  title={TOKEN_LABELS[key]}
                >
                  <input
                    type="color"
                    value={tokens[key]}
                    onChange={(e) => updateToken(key, e.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  <div
                    className="ring-border size-7 rounded-md ring-1"
                    style={{ backgroundColor: tokens[key] }}
                  />
                </label>
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground truncate text-xs">
                    {TOKEN_LABELS[key]}
                  </p>
                </div>
                <Input
                  value={tokens[key]}
                  onChange={(e) => updateToken(key, e.target.value)}
                  className="h-6 w-20 shrink-0 font-mono text-xs"
                />
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex">
            <Button
              size="sm"
              variant="ghost"
              onClick={reset}
              className="flex-1"
            >
              <IconRefresh size={14} />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
