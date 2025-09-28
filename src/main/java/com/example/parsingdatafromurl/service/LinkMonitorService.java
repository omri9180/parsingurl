package com.example.parsingdatafromurl.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.*;

@Service
public class LinkMonitorService {
    @Autowired
    private ParsingDataMangerService parsingDataMangerService;

    private final ParsingService parsingService;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(5);

    // שמירה של התוצאות האחרונות
    private final ConcurrentHashMap<String, String> lastResults = new ConcurrentHashMap<>();

    // שמירה של ה-Future של כל לינק
    private final ConcurrentHashMap<String, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    public LinkMonitorService(ParsingService parsingService, ParsingDataMangerService parsingDataMangerService) {
        this.parsingService = parsingService;
        this.parsingDataMangerService = parsingDataMangerService;
    }

    public void addLinkForMonitoring(String url, long intervalSeconds) {
        // אם כבר מנוטר – נבטל קודם
        stopMonitoring(url);

        ScheduledFuture<?> future = scheduler.scheduleAtFixedRate(
                () -> checkLink(url),
                0,
                intervalSeconds,
                TimeUnit.SECONDS
        );

        scheduledTasks.put(url, future);
    }

    private void checkLink(String url) {
        try {
            String newResult = parsingService.parseUrl(url);
            String last = lastResults.get(url);

            if (last == null) {
                parsingDataMangerService.saveOrUpdateParsingData(url, newResult);
                System.out.println("👀 Started tracking: " + url + " => " + newResult);
            } else if (!last.equals(newResult)) {
                System.out.println("⚡ Change detected at " + url + ":\nOld: " + last + "\nNew: " + newResult);
            } else {
                System.out.println("✔ No change at " + url);
            }


            lastResults.put(url, newResult);

        } catch (Exception e) {
            System.err.println("✖ Error while checking " + url + ": " + e.getMessage());
        }
    }

    public Map<String, String> getLastResults() {
        return lastResults;
    }

    public void stopMonitoring(String url) {
        // ביטול המשימה אם קיימת
        ScheduledFuture<?> future = scheduledTasks.remove(url);
        if (future != null) {
            future.cancel(true);
            System.out.println("🛑 Monitoring stopped for: " + url);
        }

        // הסרת התוצאה האחרונה
        lastResults.remove(url);
    }

    public void shutdownALL(){
        scheduler.shutdown();
    }

}
