package com.example.parsingdatafromurl.reposetory;

import com.example.parsingdatafromurl.model.ParsingData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParsingDataRepository extends JpaRepository<ParsingData, Long> {
    Optional<ParsingData> findByUrl(String url);
}
