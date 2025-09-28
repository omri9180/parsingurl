import React, { useState, useEffect, useCallback } from 'react';
import * as apiService from './services/apiService';
import UrlInput from './components/InputUrl.jsx';
import UrlItem from './components/UrlsList.jsx';

const App = () => {
    const [urls, setUrls] = useState([]);
    const [urlStatuses, setUrlStatuses] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)

    const fetchAllData = useCallback(async () => {
        try {
            setIsLoading(true);
            const fetchedUrls = await apiService.getAllUrls();
            setUrls(fetchedUrls);
            const statuses = await apiService.getStatus();
            setUrlStatuses(statuses);
        } catch (e) {
            setError('Failed to fetch initial data. Is the backend running?');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchStatuses = useCallback(async () => {
        try {
            const statuses = await apiService.getStatus();
            setUrlStatuses(prevStatuses => ({ ...prevStatuses, ...statuses }));
        } catch (e) {
            console.error('Failed to update statuses', e);
        }
    }, []);

    useEffect(()=>{
        fetchAllData();
    },[isLoading]);

    useEffect(() => {
        fetchAllData();
        const intervalId = setInterval(fetchStatuses, 5000); // Poll for statuses every 5 seconds
        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAllData]);

    const handleAddUrl = async (url, interval) => {
        try {
            setIsLoading(true);
            await apiService.addUrl(url, interval);
            await fetchAllData(); // Refresh everything after adding
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
            setError(`Failed to add URL: ${errorMessage}`);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUrl = async (url, id) => {
        if (window.confirm(`Are you sure you want to delete ${url}?`)) {
            try {
                await apiService.removeUrl(url, id);
                setUrls(prevUrls => prevUrls.filter(u => u.id !== id));
            } catch (e) {
                setError('Failed to delete URL.');
                console.error(e);
            }
        }
    };

    const handleDeleteAll = async () => {
        if (window.confirm('Are you sure you want to delete ALL monitored URLs?')) {
            try {
                await apiService.removeAllUrls();
                setUrls([]);
                setUrlStatuses({});
            } catch (e) {
                setError('Failed to delete all URLs.');
                console.error(e);
            }
        }
    };

    const handleStartMonitor = async (url, interval) => {
        try {
            await apiService.addUrl(url, interval);
            alert(`Monitoring task for ${url} has been re-submitted.`);
        } catch (e) {
            setError(`Failed to start monitoring for ${url}.`);
            console.error(e);
        }
    };

    const handleStartMonitorAll = async () => {
        if (urls.length === 0) {
            alert("No URLs to monitor.");
            return;
        }
        const promises = urls.map(u => apiService.addUrl(u.url, u.interval));
        try {
            await Promise.all(promises);
            alert("Successfully started monitoring all URLs.");
        } catch (e) {
            setError("An error occurred while starting to monitor all URLs.");
            console.error(e);
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen text-white p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
                        URL Monitoring Dashboard
                    </h1>
                    <p className="mt-2 text-slate-400">Keep an eye on your important web resources.</p>
                </header>

                <UrlInput onAddUrl={handleAddUrl} isLoading={isLoading} />

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                        <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <svg className="fill-current h-6 w-6 text-red-400" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                        </button>
                    </div>
                )}

                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-slate-200">Monitored URLs ({urls.length})</h2>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            <button onClick={handleStartMonitorAll} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-500 transition-colors disabled:bg-slate-600" disabled={urls.length === 0}>
                                Start Monitor All
                            </button>
                            <button onClick={handleDeleteAll} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors disabled:bg-slate-600" disabled={urls.length === 0}>
                                Delete All
                            </button>
                        </div>
                    </div>

                    {isLoading && urls.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">Loading URLs...</div>
                    ) : urls.length > 0 ? (
                        <div>
                            {urls.map(urlEntry => (
                                <UrlItem
                                    key={urlEntry.id}
                                    urlEntry={urlEntry}
                                    data={urlStatuses[urlEntry.url]}
                                    onDelete={handleDeleteUrl}
                                    onStartMonitor={handleStartMonitor}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-slate-800 rounded-xl">
                            <p className="text-slate-400">No URLs are being monitored yet.</p>
                            <p className="text-slate-500 text-sm">Use the form above to add one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;