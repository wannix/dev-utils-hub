import { useState, useEffect } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { CopyButton } from "@/components/common/CopyButton";
import { CodeDisplay } from "@/components/common/CodeDisplay";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { decodeJWT } from "@/lib/converters/jwt";

export function JWTDecoder() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<any>(null);
  const [error, setError] = useState("");

  // Auto-decode when token changes
  useEffect(() => {
    if (!token.trim()) {
      setDecoded(null);
      setError("");
      return;
    }

    const result = decodeJWT(token.trim());
    
    if (result.success) {
      setDecoded(result);
      setError("");
    } else {
      setError(result.error || "An error occurred");
      setDecoded(null);
    }
  }, [token]);

  return (
    <ToolCard
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens. View header, payload, and signature information."
    >
      <div className="space-y-4">
        {/* Security Warning */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This decoder does NOT verify the JWT signature. Use only for debugging. Never trust unverified tokens in production.
          </AlertDescription>
        </Alert>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">JWT Token</label>
          <Textarea
            placeholder="Paste your JWT token here..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="min-h-[120px] font-mono text-xs"
          />
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Decoded Output */}
        {decoded && (
          <div className="space-y-4">
            {/* Expiration Status */}
            {decoded.expiresAt && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={decoded.isExpired ? "destructive" : "default"}>
                  {decoded.isExpired ? "Expired" : "Valid"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Expires: {decoded.expiresAt.toLocaleString()}
                </span>
              </div>
            )}

            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Header</label>
                <CopyButton text={JSON.stringify(decoded.header, null, 2)} />
              </div>
              <CodeDisplay>
                {JSON.stringify(decoded.header, null, 2)}
              </CodeDisplay>
            </div>

            {/* Payload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Payload</label>
                <CopyButton text={JSON.stringify(decoded.payload, null, 2)} />
              </div>
              <CodeDisplay>
                {JSON.stringify(decoded.payload, null, 2)}
              </CodeDisplay>
            </div>

            {/* Signature */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Signature</label>
                <CopyButton text={decoded.signature} />
              </div>
              <CodeDisplay>{decoded.signature}</CodeDisplay>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
}
