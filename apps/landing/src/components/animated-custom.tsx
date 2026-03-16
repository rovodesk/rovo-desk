// // {/* Glass Canvas */}
// //                                 {/* <div className="h-full w-full overflow-hidden rounded-2xl backdrop-blur-sm">
// //                                     <AnimatePresence mode="wait">
// //                                         <motion.div
// //                                             animate={{ opacity: 1, scale: 1 }}
// //                                             className="flex h-full w-full items-center justify-center"
// //                                             exit={{ opacity: 0, scale: 1.05 }}
// //                                             initial={{ opacity: 0, scale: 0.95 }}
// //                                             transition={{ duration: 0.6, ease: "anticipate" }}
// //                                         >
// //                                             <IntegrationFlowAnimation className="h-full w-full scale-[0.9] sm:scale-95 lg:scale-100" />
// //                                         </motion.div>
// //                                     </AnimatePresence>
// //                                 </div> */}

// //                                 {/* Floating UI Cursor Trail */}
// //                                 {/* <motion.div
// //                                     className="pointer-events-none absolute top-0 left-0 z-50 w-56 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-2xl backdrop-blur-xl"
// //                                     style={{
// //                                         x: smoothX,
// //                                         y: smoothY,
// //                                         // Use percentages in translate to ensure it's perfectly centered on the cursor
// //                                         translateX: "-50%",
// //                                         translateY: "-50%",
// //                                     }}>
// //                                     {/* Small Decorative "Cursor" Dot inside the UI */}
// //                                 {/* <div className="absolute -top-10 -right-20 -left-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600" />

// //                                     <div className="flex flex-col gap-3">
// //                                         <div className="flex items-center gap-2">
// //                                             <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
// //                                             <div className="h-2 w-20 rounded-full bg-slate-200" />
// //                                         </div>
// //                                         <div className="h-2 w-full rounded-full bg-slate-100" />
// //                                         <div className="h-2 w-3/4 rounded-full bg-slate-100" />

// //                                         <div className="mt-2 flex items-center justify-between border-slate-100 border-t pt-2">
// //                                             <div className="flex -space-x-2">
// //                                                 <div className="h-5 w-5 rounded-full border border-white bg-blue-100" />
// //                                                 <div className="h-5 w-5 rounded-full border border-white bg-slate-800" />
// //                                             </div>
// //                                             <div className="flex h-4 w-10 items-center justify-center rounded-md bg-blue-600/10 font-bold text-[8px] text-blue-600">
// //                                                 SYNC
// //                                             </div>
// //                                         </div>
// //                                     </div> */}
// //                                 {/* </motion.div> */}




// // function _InsightCard() {
// return (
//     <div className="group relative max-w-xl">
//         {/* BACKGROUND DEPTH: A wide, soft gradient wash */}
//         {/* FLOATING BREADCRUMB: Premium "Path" UI */}
//         <div className="mb-4 flex items-center gap-2 px-2">
//             <div className="h-1.5 w-1.5 rounded-lg bg-slate-300" />
//             <span className="font-bold font-mono text-[10px] text-slate-400 uppercase tracking-widest">
//                 RovoDesk <span className="mx-1 text-slate-200">/</span> Integrations{" "}
//                 <span className="mx-1 text-slate-200">/</span>{" "}
//                 <span className="text-blue-600">Unified_Layer</span>
//             </span>
//         </div>

//         {/* THE CARD: Border-less High-Contrast Glass */}
//         {/* CONTENT: High-density typography */}
//         <div className="relative z-10 space-y-8 rounded-2xl border border-slate-200 bg-white/10 p-6 shadow-lg backdrop-blur-md">
//             <h3 className="font-bold text-2xl text-slate-900 tracking-tight lg:text-3xl dark:text-white">
//                 Consolidate your <span className="font-serif italic">entire</span>{" "}
//                 tech stack.
//             </h3>

//             {/* ACCENT: The Scribble as a "Seal of Quality" */}
//             <div className="absolute top-8 right-8 scale-75 opacity-20 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
//                 <Scribble />
//             </div>

//             <p className="max-w-md text-lg text-slate-500 leading-relaxed transition-colors dark:text-white">
//                 Stop context-switching between Intercom, Hubspot, and Notion. RovoDesk
//                 acts as the{" "}
//                 <span className="rounded bg-slate-100 px-1.5 py-0.5 font-bold font-mono text-slate-800 text-sm dark:bg-blue-600 dark:text-white">
//                     0_sync
//                 </span>{" "}
//                 layer for your team.
//             </p>

//             {/* DATA VIZ STRIP: Premium "Live Feed" aesthetic */}
//             <div className="flex items-center gap-6 pt-4">
//                 <div className="flex flex-col">
//                     <span className="font-bold text-[10px] text-blue-600 uppercase">
//                         Latency
//                     </span>
//                     <span className="font-mono font-semibold text-sm dark:text-white">
//                         12ms
//                     </span>
//                 </div>
//                 <div className="h-8 w-px bg-slate-200" />
//                 <div className="flex flex-col">
//                     <span className="font-bold text-[10px] text-blue-600 uppercase">
//                         Throughput
//                     </span>
//                     <span className="font-mono font-semibold text-sm dark:text-white">
//                         99.9%
//                     </span>
//                 </div>

//                 {/* Animated Mini-Waveform */}
//                 <div className="flex h-6 items-end gap-0.5">
//                     {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
//                         <motion.div
//                             animate={{
//                                 height: [`${h * 100}%`, `${h * 0.5 * 100}%`, `${h * 100}%`],
//                             }}
//                             className="w-1 rounded-full bg-blue-600 dark:bg-white"
//                             key={i}
//                             transition={{
//                                 repeat: Number.POSITIVE_INFINITY,
//                                 duration: 1.5,
//                                 delay: i * 0.2,
//                             }}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>

//         {/* INTERACTIVE GLOW: Follows mouse or static corner */}
//         <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-blue-600/40 opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40" />
//     </div>
// );
// }