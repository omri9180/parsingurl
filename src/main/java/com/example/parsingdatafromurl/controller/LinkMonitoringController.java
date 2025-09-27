package com.example.parsingdatafromurl.controller;


import com.example.parsingdatafromurl.model.ParsingData;
import com.example.parsingdatafromurl.reposetory.ParsingDataRepository;
import com.example.parsingdatafromurl.service.LinkMonitorService;
import com.example.parsingdatafromurl.service.ParsingDataMangerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/monitor")
@CrossOrigin(origins = "*")
public class LinkMonitoringController {
    private ParsingDataMangerService parsingDataMangerService;
    private final LinkMonitorService monitorService;

    public LinkMonitoringController(LinkMonitorService monitorService) {
        this.monitorService = monitorService;
    }

    @GetMapping("/getall")
    public List<ParsingData> getAll(){
        return parsingDataMangerService.getAll();
    }


    @PostMapping("/add")
    public String addLink(@RequestParam String url,
                          @RequestParam(defaultValue = "30") Long interval) {
        monitorService.addLinkForMonitoring(url, interval);
        return "✅ התחלת ניטור של " + url + " כל " + interval + " שניות";
    }

    @DeleteMapping("/stopLink")
    public String stopMonitoring(@RequestParam String url) {
        monitorService.stopMonitoring(url);
        return url + " Was removed";
    }

    @DeleteMapping("/remove")
    public void removeLink(@RequestParam String url, @RequestParam Long id) {
        monitorService.stopMonitoring(url);
        parsingDataMangerService.delete(id);

    }

    @DeleteMapping("/removeAll")
    public void removeAllLinks() {
        monitorService.shutdownALL();
        parsingDataMangerService.deleteAll();
    }


    @GetMapping("/status")
    public Map<String, String> status() {
        return monitorService.getLastResults();
    }
}
