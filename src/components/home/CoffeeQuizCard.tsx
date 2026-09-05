"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { productPath } from "@/lib/product-url";
import { Check, ChevronLeft, RotateCcw, ShoppingCart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { CURRENCY } from "@/lib/currency";
import { COFFEE_GRIND_OPTIONS } from "@/data/products";
import {
  getQuizFlow,
  getQuizResult,
  resolveQuizProducts,
  type QuizAnswers,
  type QuizStyle,
} from "@/lib/coffee-quiz";

type Step = "intro" | "question" | "result";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export function CoffeeQuizCard() {
  const { addToCart, openCart } = useCart();
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [addedSlugs, setAddedSlugs] = useState<Set<string>>(new Set());

  const flow = useMemo(() => getQuizFlow(answers.style as QuizStyle | undefined), [answers.style]);
  const currentQuestion = flow[questionIndex];

  const result = useMemo(() => {
    if (step !== "result") return null;
    return getQuizResult(answers as QuizAnswers);
  }, [step, answers]);

  const resultProducts = useMemo(() => (result ? resolveQuizProducts(result) : []), [result]);

  function selectAnswer(value: string) {
    const nextAnswers: Partial<QuizAnswers> = { ...answers, [currentQuestion.id]: value };
    setAnswers(nextAnswers);

    // Recompute flow immediately when style changes, since it determines the rest of the questions.
    const nextFlow = currentQuestion.id === "style" ? getQuizFlow(value as QuizStyle) : flow;
    const nextIndex = questionIndex + 1;

    if (nextIndex >= nextFlow.length) {
      setStep("result");
    } else {
      setQuestionIndex(nextIndex);
    }
  }

  function startQuiz() {
    setStep("question");
    setQuestionIndex(0);
    setAnswers({});
    setAddedSlugs(new Set());
  }

  function restartQuiz() {
    setAnswers({});
    setQuestionIndex(0);
    setAddedSlugs(new Set());
    setStep("intro");
  }

  const progress = step === "question" ? (questionIndex / flow.length) * 100 : step === "result" ? 100 : 0;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* Soft ambient blob, purely decorative */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 opacity-60 blur-3xl [border-radius:60%_40%_30%_70%/60%_30%_70%_40%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Progress bar */}
      <div className="relative h-1 w-full bg-neutral-100">
        <motion.div
          className="h-full bg-neutral-900"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={spring}
        />
      </div>

      <div className="relative px-6 py-8 md:px-10 md:py-10">
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                <Sparkles className="size-3.5" />
                Coffee Finder
              </span>
              <h2 className="text-2xl font-semibold text-neutral-900 md:text-3xl">
                Not sure which coffee to pick?
              </h2>
              <p className="max-w-md text-sm text-neutral-500 md:text-base">
                Answer 4 quick questions and we&apos;ll match you with the coffee that fits your taste - no
                jargon, no guesswork.
              </p>
              <Button size="lg" onClick={startQuiz} className="mt-1">
                Find my coffee
              </Button>
            </motion.div>
          )}

          {step === "question" && currentQuestion && (
            <motion.div
              key={`q-${currentQuestion.id}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">
                Question {questionIndex + 1} of {flow.length}
              </p>
              <h3 className="mb-6 text-xl font-semibold text-neutral-900 md:text-2xl">
                {currentQuestion.question}
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((option, i) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => selectAnswer(option.value)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-left text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer"
                  >
                    <span className="text-lg leading-none">{option.emoji}</span>
                    {option.label}
                  </motion.button>
                ))}
              </div>
              {questionIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setQuestionIndex((i) => Math.max(0, i - 1))}
                  className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  <ChevronLeft className="size-3.5" /> Back
                </button>
              )}
            </motion.div>
          )}

          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="mb-6 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-green-700">
                  <Check className="size-3.5" />
                  Based on your answers
                </span>
                <h3 className="mt-3 text-xl font-semibold text-neutral-900 md:text-2xl">
                  {result.headline}
                </h3>
                <ul className="mx-auto mt-3 max-w-md space-y-1 text-sm text-neutral-500">
                  {result.why.map((line) => (
                    <li key={line}>You told us: {line}</li>
                  ))}
                </ul>
                <p className="mx-auto mt-3 max-w-md text-sm text-neutral-600">{result.brewNote}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {resultProducts.map((product, i) => {
                  const minPrice = Math.min(...product.variants.map((v) => v.price));
                  const isAdded = addedSlugs.has(product.slug);
                  const isPrimary = i === 0;
                  return (
                    <motion.div
                      key={product.slug}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
                      className={`relative flex flex-col overflow-hidden rounded-xl border bg-white ${
                        isPrimary ? "border-neutral-900" : "border-neutral-200"
                      }`}
                    >
                      {isPrimary && (
                        <span className="absolute left-2 top-2 z-10 rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                          Best match
                        </span>
                      )}
                      <Link to={productPath(product)} className="relative aspect-square w-full">
                        <img
                          src={product.image}
                          alt={product.name}
                          draggable={false}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col gap-1 p-3">
                        <Link
                          to={productPath(product)}
                          className="line-clamp-2 min-h-[2.5em] text-sm font-semibold text-neutral-900 hover:underline"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-neutral-500">
                          From {CURRENCY.symbol}
                          {minPrice.toLocaleString(CURRENCY.locale)}
                        </p>
                        <Button
                          size="sm"
                          variant={isAdded ? "lightgraybg" : "black"}
                          className="mt-2 w-full"
                          onClick={() => {
                            const isCoffee = product.category === "Coffee" && !product.isSamplePack;
                            addToCart(
                              product,
                              1,
                              product.variants[0],
                              undefined,
                              isCoffee ? COFFEE_GRIND_OPTIONS[0] : undefined,
                            );
                            setAddedSlugs((prev) => new Set(prev).add(product.slug));
                            toast.success("Added to cart!", {
                              description: `${product.name} (${product.variants[0].name})`,
                              action: { label: "View Cart", onClick: () => openCart() },
                            });
                          }}
                        >
                          {isAdded ? (
                            <>
                              <Check className="size-4" /> Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="size-4" /> Add to cart
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={restartQuiz}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                  Retake the quiz
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
