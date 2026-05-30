import { Injectable } from '@angular/core';
import { VocabWord, BlastWord, MatchPair } from '../models/word';

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {

  private vocabEasy: VocabWord[] = [
    { word: 'HAPPY', type: 'adjective', translation: 'senang', sentence: 'She was happy to see her friend.', options: ['senang', 'marah', 'lelah', 'takut'] },
    { word: 'BEAUTIFUL', type: 'adjective', translation: 'cantik', sentence: 'What a beautiful sunset!', options: ['jelek', 'cantik', 'besar', 'kecil'] },
    { word: 'WATER', type: 'noun', translation: 'air', sentence: 'Please drink more water.', options: ['api', 'air', 'angin', 'tanah'] },
    { word: 'BRAVE', type: 'adjective', translation: 'berani', sentence: 'The brave knight fought the dragon.', options: ['berani', 'takut', 'malu', 'malas'] },
    { word: 'DREAM', type: 'noun', translation: 'mimpi', sentence: 'Follow your dream.', options: ['mimpi', 'cerita', 'lagu', 'gambar'] },
    { word: 'FAMILY', type: 'noun', translation: 'keluarga', sentence: 'Family is everything.', options: ['teman', 'keluarga', 'tetangga', 'orang'] },
    { word: 'STRONG', type: 'adjective', translation: 'kuat', sentence: 'He is a very strong man.', options: ['lemah', 'cepat', 'kuat', 'lambat'] },
    { word: 'FRIEND', type: 'noun', translation: 'teman', sentence: 'She is my best friend.', options: ['musuh', 'teman', 'saudara', 'guru'] },
    { word: 'SLEEP', type: 'verb', translation: 'tidur', sentence: 'I need to sleep early tonight.', options: ['makan', 'berlari', 'tidur', 'bermain'] },
    { word: 'LIGHT', type: 'noun', translation: 'cahaya', sentence: 'The light was too bright.', options: ['gelap', 'cahaya', 'bayangan', 'malam'] },
  ];

  private vocabHard: VocabWord[] = [
    { word: 'RESILIENCE', type: 'noun', translation: 'ketangguhan', sentence: 'Her resilience helped her overcome challenges.', options: ['ketangguhan', 'kepedulian', 'kebaikan', 'ketakutan'] },
    { word: 'ELOQUENT', type: 'adjective', translation: 'fasih', sentence: 'He gave an eloquent speech.', options: ['fasih', 'bisu', 'kasar', 'malu'] },
    { word: 'AMBIGUOUS', type: 'adjective', translation: 'ambigu', sentence: 'The message was ambiguous.', options: ['ambigu', 'jelas', 'pasti', 'langsung'] },
    { word: 'PERSEVERE', type: 'verb', translation: 'bertekun', sentence: 'You must persevere to succeed.', options: ['bertekun', 'menyerah', 'menunggu', 'berlomba'] },
    { word: 'DILIGENT', type: 'adjective', translation: 'tekun', sentence: 'She is a very diligent student.', options: ['tekun', 'malas', 'pintar', 'baik'] },
    { word: 'AMBITIOUS', type: 'adjective', translation: 'ambisius', sentence: 'He is very ambitious about his career.', options: ['ambisius', 'sederhana', 'rendah hati', 'pemalas'] },
    { word: 'SINCERE', type: 'adjective', translation: 'tulus', sentence: 'Her apology was sincere.', options: ['tulus', 'palsu', 'kasar', 'dingin'] },
    { word: 'EMPATHY', type: 'noun', translation: 'empati', sentence: 'Show empathy to others.', options: ['empati', 'amarah', 'kebencian', 'ketakutan'] },
    { word: 'PROFOUND', type: 'adjective', translation: 'mendalam', sentence: 'He has a profound understanding of art.', options: ['mendalam', 'dangkal', 'biasa', 'ringan'] },
    { word: 'MAGNIFICENT', type: 'adjective', translation: 'megah', sentence: 'The palace was magnificent.', options: ['megah', 'biasa', 'kecil', 'sederhana'] },
  ];

  private blastWords: BlastWord[] = [
    { word: 'WATER', translation: 'air', hint: 'Cair, untuk minum' },
    { word: 'DREAM', translation: 'mimpi', hint: 'Terjadi saat tidur' },
    { word: 'BRAVE', translation: 'berani', hint: 'Tidak takut' },
    { word: 'HAPPY', translation: 'senang', hint: 'Perasaan gembira' },
    { word: 'LIGHT', translation: 'cahaya', hint: 'Dari matahari atau lampu' },
    { word: 'TRUST', translation: 'percaya', hint: 'Yakin pada seseorang' },
    { word: 'SMILE', translation: 'senyum', hint: 'Ekspresi wajah positif' },
    { word: 'HOUSE', translation: 'rumah', hint: 'Tempat tinggal' },
  ];

  private matchSets: MatchPair[][] = [
    [
      { en: 'HAPPY', id: 'Senang' },
      { en: 'FRIEND', id: 'Teman' },
      { en: 'WATER', id: 'Air' },
      { en: 'BRAVE', id: 'Berani' },
      { en: 'DREAM', id: 'Mimpi' },
      { en: 'FAMILY', id: 'Keluarga' },
    ],
    [
      { en: 'STRONG', id: 'Kuat' },
      { en: 'LIGHT', id: 'Cahaya' },
      { en: 'SLEEP', id: 'Tidur' },
      { en: 'TRUST', id: 'Percaya' },
      { en: 'SMILE', id: 'Senyum' },
      { en: 'JOURNEY', id: 'Perjalanan' },
    ],
  ];

  getVocabEasy(): VocabWord[] {
    return [...this.vocabEasy].sort(() => Math.random() - 0.5).slice(0, 10);
  }

  getVocabHard(): VocabWord[] {
    return [...this.vocabHard].sort(() => Math.random() - 0.5).slice(0, 10);
  }

  getBlastWords(): BlastWord[] {
    return [...this.blastWords].sort(() => Math.random() - 0.5).slice(0, 6);
  }

  getMatchSet(): MatchPair[] {
    const idx = Math.floor(Math.random() * this.matchSets.length);
    return this.matchSets[idx];
  }
}