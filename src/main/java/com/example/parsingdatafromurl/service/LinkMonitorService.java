package com.example.parsingdatafromurl.service;

import com.example.parsingdatafromurl.model.ParsingData;
import com.example.parsingdatafromurl.service.ParsingDataMangerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public LinkMonitorService(ParsingService parsingService) {
        this.parsingService = parsingService;
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
                System.out.println("👀 התחלת מעקב אחרי: " + url + " => " + newResult);
            } else if (!last.equals(newResult)) {
                parsingDataMangerService.saveOrUpdateParsingData(url, newResult);
                System.out.println("⚡ שינוי התגלה ב-" + url + ":\nישן: " + last + "\nחדש: " + newResult);
            } else {
                System.out.println("✔ אין שינוי ב-" + url);
            }

            lastResults.put(url, newResult);

        } catch (Exception e) {
            System.err.println("✖ שגיאה בבדיקה של " + url + ": " + e.getMessage());
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
            System.out.println("🛑 ניטור הופסק עבור: " + url);
        }

        // הסרת התוצאה האחרונה
        lastResults.remove(url);
    }

    public void shutdownALL(){
        scheduler.shutdown();
    }

}
