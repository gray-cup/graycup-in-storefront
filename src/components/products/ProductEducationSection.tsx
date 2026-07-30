import type { CoffeeProcess } from "@/data/products";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { PROCESS_DESCRIPTIONS } from "./ProcessBadge";

const FLAVOUR_NOTES_EXPLANATION =
  "Flavour notes describe the tastes and aromas you might pick up in the cup - similar to tasting notes on wine or whisky. They come from the coffee's origin, processing method, and roast, and are a guide to what to expect rather than a guarantee of what you'll taste.";

type ProductEducationSectionProps = {
  process?: CoffeeProcess;
  flavourNotes?: string[];
};

export function ProductEducationSection({
  process,
  flavourNotes,
}: ProductEducationSectionProps) {
  const hasProcess = Boolean(process) && process !== "Pending";
  const hasFlavourNotes = Boolean(flavourNotes && flavourNotes.length > 0);

  if (!hasProcess && !hasFlavourNotes) return null;

  return (
    <div className="mt-16 pt-16 border-t border-gray-200">
      <h2 className="text-4xl md:text-5xl font-semibold italic text-blue-600">
        Good to know
      </h2>
      <div className="mt-10 max-w-2xl">
        <Accordion
          type="multiple"
          defaultValue={["flavour-notes", "process"]}
        >
          {hasFlavourNotes && (
            <AccordionItem value="flavour-notes">
              <AccordionTrigger>What do &quot;flavour notes&quot; mean?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-700 leading-relaxed">
                  {FLAVOUR_NOTES_EXPLANATION}
                </p>
              </AccordionContent>
            </AccordionItem>
          )}
          {hasProcess && (
            <AccordionItem value="process">
              <AccordionTrigger>What is &quot;{process}&quot; processing?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-700 leading-relaxed">
                  {PROCESS_DESCRIPTIONS[process as CoffeeProcess]}
                </p>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
}
