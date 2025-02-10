import { Globe } from "@/components/ui/globe";

const GlobeCard = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="group relative col-span-1 md:col-span-2 flex flex-col justify-between overflow-hidden rounded-xl bg-[#090909] shadow-lg dark:bg-[#0f0f0f] dark:border dark:border-[rgba(255,255,255,0.1)] p-8 lg:p-10 min-h-[400px] hover:scale-[1.01] transition-transform duration-300 w-full"
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
          <Globe 
            className="absolute -top-32 right-[-20%] w-[140%] h-[140%] opacity-60 transition-opacity duration-300 dark:opacity-40 group-hover:opacity-80" 
          />
        </div>
  
        <div className="relative z-10 flex flex-col gap-4 mt-auto">
          <div className="flex items-center gap-3">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 group-hover:scale-95 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.5 12a7.5 7.5 0 0115 0m-15 0a7.5 7.5 0 1015 0M4.5 12a7.5 7.5 0 0115 0m-15 0a7.5 7.5 0 1015 0"
              />
            </svg>
            <h3 className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              Production Observability
            </h3>
          </div>
          <p className="text-gray-400 text-lg sm:text-xl max-w-[90%] sm:max-w-[80%] leading-relaxed">
            Collect production data (errors, performance) and see it in your IDE for real-time insights.
          </p>
        </div>
      </motion.div>
    );
  };