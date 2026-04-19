import React from 'react';

const PageLoader = ({ message = "Syncing Experiences..." }) => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-transparent gap-6 animate-in fade-in duration-700">
            <div className="relative">
                <div className="w-16 h-16 border-[3px] border-accent-gold/10 rounded-full" />
                <div className="absolute top-0 w-16 h-16 border-[3px] border-accent-gold border-t-transparent rounded-full animate-spin" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-coffee-brown rounded-full animate-pulse shadow-lg shadow-coffee-brown/20" />
            </div>
            <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee-brown/30 ml-1">{message}</p>
                <div className="mt-3 flex gap-1 justify-center">
                    <div className="w-1 h-1 bg-accent-gold rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1 h-1 bg-accent-gold rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1 h-1 bg-accent-gold rounded-full animate-bounce" />
                </div>
            </div>
        </div>
    );
};

export default PageLoader;
