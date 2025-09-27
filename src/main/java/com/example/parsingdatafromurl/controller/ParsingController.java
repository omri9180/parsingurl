package com.example.parsingdatafromurl.controller;

import com.example.parsingdatafromurl.service.ParsingService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ParsingController {

    private final ParsingService parsingService;
    public ParsingController(ParsingService parsingService) {
        this.parsingService = parsingService;
    }


    @GetMapping("/parseUrl")
    public String parseJson(@RequestParam String url) throws IOException, InterruptedException {
        return parsingService.parseUrl(url);
    }

}
