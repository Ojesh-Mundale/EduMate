package com.edumate.aistudybuddy.controller;

import java.net.http.HttpClient;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edumate.aistudybuddy.service.GeminiApiService;

@RestController
@RequestMapping("/api")
public class AiController {


    private final HttpClient httpClient = HttpClient.newHttpClient();

    // Removed gemiiApiUrl and gemiiApiKey fields and callGemiiApi method as per new plan

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String text = "";
        try {
            String filename = file.getOriginalFilename().toLowerCase();
            if (filename.endsWith(".pdf")) {
                org.apache.pdfbox.pdmodel.PDDocument document = org.apache.pdfbox.pdmodel.PDDocument.load(file.getInputStream());
                org.apache.pdfbox.text.PDFTextStripper stripper = new org.apache.pdfbox.text.PDFTextStripper();
                text = stripper.getText(document);
                document.close();
            } else if (filename.endsWith(".png") || filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
                // Use Tesseract OCR to extract text from image
                net.sourceforge.tess4j.Tesseract tesseract = new net.sourceforge.tess4j.Tesseract();
                text = tesseract.doOCR(javax.imageio.ImageIO.read(file.getInputStream()));
            } else {
                text = new String(file.getBytes());
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("text", "Error extracting text from file."));
        }
        return ResponseEntity.ok(Map.of("text", text));
    }

    private final GeminiApiService geminiApiService;

    public AiController(GeminiApiService geminiApiService) {
        this.geminiApiService = geminiApiService;
    }

    @PostMapping("/summarize")
    public ResponseEntity<Map<String, String>> summarize(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        String prompt = "Summarize the following notes in bullet points:\n\n" + content;
        String summary = geminiApiService.getResponse(prompt);
        return ResponseEntity.ok(Map.of("response", summary));
    }

    @PostMapping("/quiz")
    public ResponseEntity<Map<String, Object>> quiz(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        // Use new method to get structured quiz JSON
        com.fasterxml.jackson.databind.JsonNode quizJson = geminiApiService.generateQuizStructured(content);
        if (quizJson == null) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to generate quiz"));
        }
        return ResponseEntity.ok(Map.of("response", quizJson));
    }

    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> ask(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        String prompt = "Explain this in simple terms: " + question;
        String answer = geminiApiService.getResponse(prompt);
        return ResponseEntity.ok(Map.of("response", answer));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String prompt = "You are a helpful study assistant. Respond conversationally to: " + message;
        String response = geminiApiService.getResponse(prompt);
        return ResponseEntity.ok(Map.of("response", response));
    }

    @PostMapping("/clearChat")
    public ResponseEntity<Map<String, String>> clearChat() {
        // No server-side chat state to clear currently
        return ResponseEntity.ok(Map.of("status", "Chat history cleared"));
    }
}
