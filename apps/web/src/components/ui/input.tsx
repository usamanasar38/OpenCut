import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";
import { Button } from "./button";

interface InputProps extends React.ComponentProps<"input"> {
  showPassword?: boolean;
  onShowPasswordChange?: (show: boolean) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, showPassword, onShowPasswordChange, value, ...props },
    ref,
  ) => {
    const isPassword = type === "password";
    const showPasswordToggle = isPassword && onShowPasswordChange;
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="relative w-full">
        <input
          type={inputType}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            showPasswordToggle && "pr-10",
            className,
          )}
          ref={ref}
          value={value}
          {...props}
        />
        {showPasswordToggle && (
          <Button
            type="button"
            variant="text"
            size="icon"
            onClick={() => onShowPasswordChange?.(!showPassword)}
            className="absolute top-0 right-0 h-full px-3 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
