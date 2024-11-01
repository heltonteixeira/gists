import React from 'react';

interface MainLayoutProps {
    children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className= "min-h-screen bg-background-primary flex flex-col" >
        <header className="flex items-center justify-between h-16 px-6 py-4 md:px-8 lg:px-10 bg-background-secondary border-b border-secondary/10" >
            <div className="flex items-center space-x-22" >
                <h1 className="text-2xl font-medium text-primary" > Agentic Assistant </h1>
                    </div>
                    < nav className = "hidden md:flex items-center space-x-6 lg:space-x-8" >
                        <button 
                        type="button"
    className = "text-secondary-dark hover:text-primary transition-colors duration-200"
        >
        Configuration
        </button>
        < button
    type = "button"
    className = "text-secondary-dark hover:text-primary transition-colors duration-200"
        >
        Documentation
        </button>
        < button
    type = "button"
    className = "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
        >
        New Chat
            </button>
            </nav>
            </header>

            < main className = "flex-1 container mx-auto grid grid-cols-1 md:grid-cols-main gap-6 p-6 md:p-8 lg:p-10" >
                <aside className="space-y-6" >
                    <div className="bg-background-secondary rounded-lg p-6 shadow-sm" >
                        <h2 className="text-lg font-medium text-secondary-dark mb-4" > Provider Settings </h2>
                            </div>
                            < div className = "bg-background-secondary rounded-lg p-6 shadow-sm" >
                                <h2 className="text-lg font-medium text-secondary-dark mb-4" > Model Configuration </h2>
                                    </div>
                                    </aside>

                                    < section className = "flex flex-col space-y-6" >
                                        <div className="flex-1 bg-background-secondary rounded-lg p-6 shadow-sm min-h-[600px]" >
                                            { children }
                                            </div>
                                            < div className = "bg-background-secondary rounded-lg p-6 shadow-sm" >
                                                <div className="flex gap-4" >
                                                    <input 
                                type="text"
    className = "flex-1 px-4 py-2 rounded-md border border-secondary/10 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 bg-background-primary"
    placeholder = "Type your message..."
        />
        <button 
                                type="button"
    className = "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
        >
        Send
        </button>
        </div>
        </div>
        </section>
        </main>

        < footer className = "mt-auto py-4 px-6 md:px-8 lg:px-10 bg-background-secondary border-t border-secondary/10" >
            <div className="container mx-auto flex justify-between items-center text-sm text-secondary" >
                <span>Agentic Assistant </span>
                    < span > Version 0.1.0 </span>
                        </div>
                        </footer>
                        </div>
    );
};
