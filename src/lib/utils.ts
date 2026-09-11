import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The type scale ships as custom utilities —
 * `text-h2`, `text-copy-sm`, `text-label-xs-mono`. tailwind-merge has no
 * way to know those are font sizes, and its `text-color` group ends in a
 * catch-all, so it files them as colours and silently drops any real colour
 * class sitting alongside them. That is how a primary button ends up
 * rendering its label in the same colour as its fill.
 *
 * Two changes fix it for every component at once: teach `font-size` about the
 * pattern, and stop `text-color` claiming it. Theme getters are left alone —
 * only the plain validators need guarding.
 */
const isTypeScaleClass = (value: string) =>
  /^(h[1-5]|label-overline|(copy|label|button)-(xs|sm|default)(-mono)?)$/.test(
    value,
  );

/**
 * The four text-colour ranks are custom utilities too, so tailwind-merge does
 * not recognise them either — and left alone it keeps both of a conflicting
 * pair, letting source order decide. That is how an inactive nav item ended
 * up carrying `text-secondary` and `text-primary` at once.
 */
const isTextColourRank = (value: string) =>
  /^(primary|secondary|tertiary|disabled)$/.test(value);

type Validator = ((value: string) => boolean) & { isThemeGetter?: boolean };

const twMerge = extendTailwindMerge((config) => {
  const groups = config.classGroups as unknown as Record<
    string,
    { text: Validator[] }[]
  >;

  groups["font-size"] = [...groups["font-size"], { text: [isTypeScaleClass] }];
  groups["text-color"] = [
    ...groups["text-color"],
    { text: [isTextColourRank] },
  ];

  const textColor = groups["text-color"][0];
  textColor.text = textColor.text.map((validator) =>
    typeof validator === "function" && !validator.isThemeGetter
      ? (value: string) => !isTypeScaleClass(value) && validator(value)
      : validator,
  );

  return config;
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
