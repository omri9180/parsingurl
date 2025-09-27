package com.example.parsingdatafromurl.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;


@Service
public class ParsingService {
    private ParsingDataMangerService parsingDataMangerService;


    public String parseHtml(String url) throws IOException {
        Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                .referrer("http://www.google.com")
                .timeout(10_000)
                .ignoreHttpErrors(true)
                .get();

        Map<String, Object> result = new HashMap<>();
        result.put("title", doc.title());
        result.put("h1", doc.select("h1").eachText());
        result.put("h2", doc.select("h2").eachText());
        result.put("h3", doc.select("h3").eachText());
        result.put("paragraphs", doc.select("p").eachText());
        result.put("links", doc.select("a[href]").eachAttr("href"));

        // המרה ל־JSON String
        ObjectMapper mapper = new ObjectMapper();
        parsingDataMangerService.saveOrUpdateParsingData(url, mapper.writeValueAsString(result));
        return mapper.writeValueAsString(result);
    }


    /**
for test : http://localhost:8080/api/parseUrl?url=https://microsoftedge.github.io/Demos/json-dummy-data/512KB.json
     */
    public String parseJson(String url) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(new URL(url));
        ArrayNode result = mapper.createArrayNode();

        for (JsonNode node : root) {
            ObjectNode filtered = mapper.createObjectNode();
            filtered.put("name", node.get("name").asText());
            filtered.put("bio", node.get("bio").asText());
            filtered.put("id", node.get("id").asText());
            result.add(filtered);
        }
        parsingDataMangerService.saveOrUpdateParsingData(url, mapper.writeValueAsString(result));
        return mapper.writeValueAsString(result);
    }

    /**
     * פונקציה מרכזית – בודקת אם מדובר ב־JSON או HTML,
     * וקוראת למתודה המתאימה.
     */
    public String parseUrl(String url) throws IOException {
        try {
            // Try to parse as JSON
            ObjectMapper mapper = new ObjectMapper();
            mapper.readTree(new URL(url));  // throws if not JSON
            return parseJson(url);
        } catch (Exception e) {
            // Not valid JSON, try HTML
            return parseHtml(url);
        }
    }

}
