package com.example.parsingdatafromurl.service;

import com.example.parsingdatafromurl.model.ParsingData;
import com.example.parsingdatafromurl.reposetory.ParsingDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ParsingDataMangerService {

    @Autowired
    private ParsingDataRepository parsingDataRepository;

    public void saveOrUpdateParsingData(String url, String data) {
        Optional<ParsingData> existing = parsingDataRepository.findByUrl(url);
        if (existing.isPresent()) {
            ParsingData pd = existing.get();
            if (!pd.getData().equals(data)) {
                pd.setData(data);
                pd.setDate(LocalDateTime.now()); // update timestamp if you track changes
                parsingDataRepository.save(pd);
            }
        } else {
            ParsingData newData = new ParsingData(url, data);
            parsingDataRepository.save(newData);
        }
    }

    public List<ParsingData> getAll() {
       return parsingDataRepository.findAll();
    }


    public void delete(long id) {
        parsingDataRepository.deleteById(id);
    }
    public void deleteAll() {
        parsingDataRepository.deleteAll();
    }

}
