export default function DotCard({ cardDescription, cardTitle }: { cardDescription: string, cardTitle: string }) {
    return (
        <div className="relative mx-auto w-full max-w-sm rounded-lg border border-zinc-300 border-dashed px-4 sm:px-6 md:px-8 dark:border-zinc-800">
            <div className="absolute top-4 left-0 -z-0 h-px w-full bg-zinc-400 sm:top-6 md:top-8 dark:bg-zinc-700" />
            <div className="absolute bottom-4 left-0 z-0 h-px w-full bg-zinc-400 sm:bottom-6 md:bottom-8 dark:bg-zinc-700" />
            <div className="relative w-full border-zinc-400 border-x dark:border-zinc-700">
                <div className="absolute z-0 grid h-full w-full items-center">
                    <section className="absolute z-0 grid h-full w-full grid-cols-2 place-content-between">
                        <div className="my-4 size-1 -translate-x-[2.5px] rounded-full bg-primary outline outline-8 outline-gray-50 sm:my-6 md:my-8 dark:outline-gray-950" />
                        <div className="my-4 size-1 translate-x-[2.5px] place-self-end rounded-full bg-primary outline outline-8 outline-gray-50 sm:my-6 md:my-8 dark:outline-gray-950" />
                        <div className="my-4 size-1 -translate-x-[2.5px] rounded-full bg-primary outline outline-8 outline-gray-50 sm:my-6 md:my-8 dark:outline-gray-950" />
                        <div className="my-4 size-1 translate-x-[2.5px] place-self-end rounded-full bg-primary outline outline-8 outline-gray-50 sm:my-6 md:my-8 dark:outline-gray-950" />
                    </section>
                </div>
                <div className="relative z-20 mx-auto py-8">
                    <div className="p-6">
                        <h3 className="mb-1 font-bold text-gray-900 text-lg dark:text-gray-100">
                            {cardTitle}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            {cardDescription}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
