package com.example.parsingdatafromurl.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParsingData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String url;
    @Column(columnDefinition="MEDIUMTEXT")
    private String data;
    private LocalDateTime date;

    public ParsingData(String url, String data) {
        this.url = url;
        this.data = data;
        this.date = LocalDateTime.now();
    }
}
