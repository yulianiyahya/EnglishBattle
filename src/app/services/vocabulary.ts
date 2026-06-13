import { Injectable } from '@angular/core';
import { VocabWord, BlastWord, MatchPair } from '../models/word';

@Injectable({ providedIn: 'root' })
export class VocabularyService {

  private easyWords: VocabWord[] = [
    { word: 'Apple', translation: 'Apel', type: 'NOUN', sentence: 'I eat an apple every day.', options: ['Apel', 'Jeruk', 'Mangga', 'Pisang'] },
    { word: 'Book', translation: 'Buku', type: 'NOUN', sentence: 'She reads a book before sleep.', options: ['Pensil', 'Buku', 'Meja', 'Kursi'] },
    { word: 'Happy', translation: 'Bahagia', type: 'ADJ', sentence: 'I am very happy today.', options: ['Sedih', 'Marah', 'Bahagia', 'Takut'] },
    { word: 'Run', translation: 'Berlari', type: 'VERB', sentence: 'He likes to run in the morning.', options: ['Berlari', 'Berjalan', 'Melompat', 'Berenang'] },
    { word: 'Beautiful', translation: 'Cantik', type: 'ADJ', sentence: 'The flower is beautiful.', options: ['Jelek', 'Cantik', 'Besar', 'Kecil'] },
    { word: 'Water', translation: 'Air', type: 'NOUN', sentence: 'Please drink more water.', options: ['Api', 'Tanah', 'Air', 'Angin'] },
    { word: 'Sleep', translation: 'Tidur', type: 'VERB', sentence: 'I sleep at 10 PM every night.', options: ['Makan', 'Minum', 'Tidur', 'Bermain'] },
    { word: 'Friend', translation: 'Teman', type: 'NOUN', sentence: 'She is my best friend.', options: ['Musuh', 'Teman', 'Guru', 'Dokter'] },
    { word: 'School', translation: 'Sekolah', type: 'NOUN', sentence: 'I go to school every Monday.', options: ['Rumah', 'Kantor', 'Sekolah', 'Pasar'] },
    { word: 'Eat', translation: 'Makan', type: 'VERB', sentence: 'We eat together at lunch.', options: ['Minum', 'Makan', 'Tidur', 'Berlari'] },
    { word: 'House', translation: 'Rumah', type: 'NOUN', sentence: 'My house is near the park.', options: ['Rumah', 'Gedung', 'Hotel', 'Toko'] },
    { word: 'Cat', translation: 'Kucing', type: 'NOUN', sentence: 'The cat is sleeping on the sofa.', options: ['Anjing', 'Kucing', 'Burung', 'Ikan'] },
    { word: 'Big', translation: 'Besar', type: 'ADJ', sentence: 'That is a very big elephant.', options: ['Kecil', 'Besar', 'Tinggi', 'Pendek'] },
    { word: 'Fast', translation: 'Cepat', type: 'ADJ', sentence: 'The cheetah is very fast.', options: ['Lambat', 'Cepat', 'Kuat', 'Lemah'] },
    { word: 'Love', translation: 'Cinta', type: 'VERB', sentence: 'I love my family very much.', options: ['Benci', 'Cinta', 'Takut', 'Marah'] },
    { word: 'Sun', translation: 'Matahari', type: 'NOUN', sentence: 'The sun rises in the east.', options: ['Bulan', 'Bintang', 'Matahari', 'Awan'] },
    { word: 'Dog', translation: 'Anjing', type: 'NOUN', sentence: 'My dog loves to play fetch.', options: ['Kucing', 'Anjing', 'Kelinci', 'Hamster'] },
    { word: 'Cold', translation: 'Dingin', type: 'ADJ', sentence: 'The weather is very cold today.', options: ['Panas', 'Hangat', 'Dingin', 'Sejuk'] },
    { word: 'Walk', translation: 'Berjalan', type: 'VERB', sentence: 'I walk to school every day.', options: ['Berlari', 'Berjalan', 'Terbang', 'Berenang'] },
    { word: 'Night', translation: 'Malam', type: 'NOUN', sentence: 'The stars shine at night.', options: ['Pagi', 'Siang', 'Sore', 'Malam'] },
  ];

  private hardWords: VocabWord[] = [
    { word: 'Ambiguous', translation: 'Ambigu', type: 'ADJ', sentence: 'The instruction was ambiguous and confusing.', options: ['Jelas', 'Ambigu', 'Tepat', 'Pasti'] },
    { word: 'Persevere', translation: 'Bertekun', type: 'VERB', sentence: 'You must persevere to achieve your goals.', options: ['Menyerah', 'Bertekun', 'Berhenti', 'Mundur'] },
    { word: 'Eloquent', translation: 'Fasih', type: 'ADJ', sentence: 'She gave an eloquent speech at the ceremony.', options: ['Gagap', 'Fasih', 'Bisu', 'Kasar'] },
    { word: 'Resilient', translation: 'Tangguh', type: 'ADJ', sentence: 'Children are more resilient than we think.', options: ['Lemah', 'Tangguh', 'Rapuh', 'Kaku'] },
    { word: 'Innovate', translation: 'Berinovasi', type: 'VERB', sentence: 'Companies must innovate to stay competitive.', options: ['Meniru', 'Berinovasi', 'Mundur', 'Berhenti'] },
    { word: 'Humble', translation: 'Rendah Hati', type: 'ADJ', sentence: 'Despite his success, he remained humble.', options: ['Sombong', 'Rendah Hati', 'Angkuh', 'Egois'] },
    { word: 'Dedicate', translation: 'Mendedikasikan', type: 'VERB', sentence: 'She dedicated her life to helping others.', options: ['Mengabaikan', 'Mendedikasikan', 'Meninggalkan', 'Melupakan'] },
    { word: 'Profound', translation: 'Mendalam', type: 'ADJ', sentence: 'The book had a profound impact on me.', options: ['Dangkal', 'Mendalam', 'Biasa', 'Ringan'] },
    { word: 'Collaborate', translation: 'Berkolaborasi', type: 'VERB', sentence: 'We need to collaborate to finish this project.', options: ['Bersaing', 'Berkolaborasi', 'Bertengkar', 'Berpisah'] },
    { word: 'Integrity', translation: 'Integritas', type: 'NOUN', sentence: 'A leader must have integrity above all.', options: ['Korupsi', 'Integritas', 'Kebohongan', 'Kelicikan'] },
    { word: 'Spontaneous', translation: 'Spontan', type: 'ADJ', sentence: 'Her spontaneous laugh made everyone smile.', options: ['Terencana', 'Spontan', 'Dibuat-buat', 'Formal'] },
    { word: 'Empathy', translation: 'Empati', type: 'NOUN', sentence: 'Empathy is key to understanding others.', options: ['Egois', 'Empati', 'Antipati', 'Apatis'] },
    { word: 'Meticulous', translation: 'Teliti', type: 'ADJ', sentence: 'He was meticulous in cleaning the laboratory equipment.', options: ['Ceroboh', 'Teliti', 'Malas', 'Cepat'] },
    { word: 'Obsolete', translation: 'Usang', type: 'ADJ', sentence: 'Gas lamps became obsolete after the invention of electric lights.', options: ['Baru', 'Modern', 'Usang', 'Canggih'] },
    { word: 'Pragmatic', translation: 'Pragmatis', type: 'ADJ', sentence: 'We need a pragmatic approach to solve this issue.', options: ['Teoretis', 'Pragmatis', 'Khayalan', 'Ideal'] },
    { word: 'Scrutinize', translation: 'Menyelidiki', type: 'VERB', sentence: 'Customers were warned to scrutinize the small print of the contract.', options: ['Mengabaikan', 'Menyelidiki', 'Membiarkan', 'Melupakan'] },
    { word: 'Superfluous', translation: 'Berlebihan', type: 'ADJ', sentence: 'The report was filled with superfluous details.', options: ['Penting', 'Kurang', 'Berlebihan', 'Cukup'] },
    { word: 'Vulnerable', translation: 'Rentan', type: 'ADJ', sentence: 'Old people are vulnerable to the flu.', options: ['Kuat', 'Aman', 'Kebal', 'Rentan'] },
    { word: 'Anomalous', translation: 'Ganjil', type: 'ADJ', sentence: 'The scientists observed an anomalous test result.', options: ['Normal', 'Ganjil', 'Biasa', 'Sesuai'] },
    { word: 'Benevolent', translation: 'Murah Hati', type: 'ADJ', sentence: 'A benevolent uncle paid for her college tuition.', options: ['Kikir', 'Kejam', 'Murah Hati', 'Sombong'] },
  ];

  private blastWords: BlastWord[] = [
    { word: 'CAT', translation: 'Kucing', hint: 'Hewan peliharaan yang suka mengeong' },
    { word: 'DOG', translation: 'Anjing', hint: 'Sahabat setia manusia' },
    { word: 'SUN', translation: 'Matahari', hint: 'Bintang yang bersinar di siang hari' },
    { word: 'BOOK', translation: 'Buku', hint: 'Tempat ilmu pengetahuan tersimpan' },
    { word: 'RAIN', translation: 'Hujan', hint: 'Air yang turun dari langit' },
    { word: 'TREE', translation: 'Pohon', hint: 'Tumbuhan besar yang punya akar dan ranting' },
    { word: 'FISH', translation: 'Ikan', hint: 'Hewan yang hidup di air' },
    { word: 'STAR', translation: 'Bintang', hint: 'Cahaya yang bersinar di malam hari' },
    { word: 'MOON', translation: 'Bulan', hint: 'Satelit bumi yang bersinar malam' },
    { word: 'FIRE', translation: 'Api', hint: 'Panas dan bercahaya, bisa membakar' },
    { word: 'WIND', translation: 'Angin', hint: 'Udara yang bergerak dan bisa kamu rasakan' },
    { word: 'BIRD', translation: 'Burung', hint: 'Hewan bersayap yang bisa terbang' },
    { word: 'LOVE', translation: 'Cinta', hint: 'Perasaan sayang yang dalam' },
    { word: 'GOLD', translation: 'Emas', hint: 'Logam mulia berwarna kuning' },
    { word: 'JUMP', translation: 'Melompat', hint: 'Gerakan naik ke atas dengan kedua kaki' },
    { word: 'PLAY', translation: 'Bermain', hint: 'Kegiatan yang menyenangkan' },
    { word: 'SING', translation: 'Bernyanyi', hint: 'Mengeluarkan suara mengikuti melodi' },
    { word: 'CAKE', translation: 'Kue', hint: 'Makanan manis yang sering ada di ulang tahun' },
    { word: 'BLUE', translation: 'Biru', hint: 'Warna langit dan laut' },
    { word: 'FAST', translation: 'Cepat', hint: 'Berlawanan dengan lambat' },
  ];

  private matchSets: MatchPair[][] = [
    [
      { en: 'Apple', id: 'Apel' },
      { en: 'Water', id: 'Air' },
      { en: 'Happy', id: 'Bahagia' },
      { en: 'Run', id: 'Berlari' },
      { en: 'Sleep', id: 'Tidur' },
      { en: 'Friend', id: 'Teman' },
    ],
    [
      { en: 'Sun', id: 'Matahari' },
      { en: 'Moon', id: 'Bulan' },
      { en: 'Star', id: 'Bintang' },
      { en: 'Fire', id: 'Api' },
      { en: 'Wind', id: 'Angin' },
      { en: 'Rain', id: 'Hujan' },
    ],
    [
      { en: 'Love', id: 'Cinta' },
      { en: 'Fast', id: 'Cepat' },
      { en: 'Big', id: 'Besar' },
      { en: 'Cold', id: 'Dingin' },
      { en: 'Walk', id: 'Berjalan' },
      { en: 'Night', id: 'Malam' },
    ],
    [
      { en: 'Humble', id: 'Rendah Hati' },
      { en: 'Resilient', id: 'Tangguh' },
      { en: 'Empathy', id: 'Empati' },
      { en: 'Integrity', id: 'Integritas' },
      { en: 'Eloquent', id: 'Fasih' },
      { en: 'Profound', id: 'Mendalam' },
    ],
  ];

  getVocabEasy(): VocabWord[] {
    return this.shuffle([...this.easyWords]).slice(0, 10);
  }

  getVocabHard(): VocabWord[] {
    return this.shuffle([...this.hardWords]).slice(0, 10);
  }

  getBlastWords(): BlastWord[] {
    return this.shuffle([...this.blastWords]).slice(0, 10);
  }

  getMatchSet(): MatchPair[] {
    const sets = this.shuffle([...this.matchSets]);
    return sets[0];
  }

  private shuffle<T>(arr: T[]): T[] {
    return arr.sort(() => Math.random() - 0.5);
  }
}