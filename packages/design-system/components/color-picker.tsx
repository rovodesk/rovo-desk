import { forwardRef, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { cn } from '../lib/utils';
import type { ButtonProps } from '../components/ui/button';
import { Button } from '../components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { Input } from '../components/ui/input';
import { Droplet, Hash } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

// Preset colors often found in modern SaaS branding
const PRESET_COLORS = [
  '#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', 
  '#ef4444', '#ec4899', '#8b5cf6', '#64748b'
];

const ColorPicker = forwardRef<
  HTMLInputElement,
  Omit<ButtonProps, 'value' | 'onChange' | 'onBlur'> & ColorPickerProps
>(
  (
    { disabled, value, onChange, onBlur, name, className, size, ...props },
    forwardedRef
  ) => {
    const [open, setOpen] = useState(false);

    const parsedValue = useMemo(() => {
      return value || '#4f46e5';
    }, [value]);

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            {...props}
            className={cn('relative overflow-hidden transition-all hover:scale-105 active:scale-95 border-2 border-slate-200 dark:border-slate-800', className)}
            name={name}
            onBlur={onBlur}
            size={size || 'icon'}
            style={{
              backgroundColor: parsedValue,
              borderColor: 'rgba(0,0,0,0.1)',
            }}
            variant='outline'
          >
            {/* Contrast check icon: if background is very light, icon is dark, and vice versa */}
            <Droplet className="size-4 mix-blend-difference text-white" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className='w-64 p-3 shadow-xl' align="start">
          <div className="flex flex-col space-y-3">
            {/* The Visual Picker */}
            <div className="custom-color-picker">
                <HexColorPicker 
                  color={parsedValue} 
                  onChange={onChange} 
                  className="w-full! h-40!" 
                />
            </div>

            {/* Manual Hex Input with Icon */}
            <div className="relative">
              <Hash className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                className="pl-8 font-mono text-xs uppercase"
                maxLength={7}
                onChange={(e) => {
                  const val = e.currentTarget.value;
                  // Basic validation: only update if it's a valid hex character set
                  if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
                    onChange(val.startsWith('#') ? val : `#${val}`);
                  }
                }}
                ref={forwardedRef}
                value={parsedValue}
              />
            </div>

            {/* Quick Select Presets */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset}
                  className={cn(
                    "h-6 w-full rounded-md border border-black/10 transition-transform hover:scale-110",
                    parsedValue.toLowerCase() === preset.toLowerCase() && "ring-2 ring-offset-2 ring-ring"
                  )}
                  style={{ backgroundColor: preset }}
                  onClick={() => onChange(preset)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };