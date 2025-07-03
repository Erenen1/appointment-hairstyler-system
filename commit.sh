#!/bin/bash

# Renklendirme için ANSI renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Git durumu kontrol ediliyor...${NC}"
git status

# Değişiklikleri staged area'ya ekle
echo -e "${YELLOW}Değişiklikleri staged area'ya ekleniyor...${NC}"
git add .

# Commit mesajı için tarih al
DATE=$(date +"%Y-%m-%d %H:%M")

# Commit tipleri için prefix'ler
# feat: Yeni bir özellik
# fix: Hata düzeltmesi
# docs: Sadece dokümantasyon değişiklikleri
# style: Kod stilini etkileyen değişiklikler (boşluk, format, noktalama vb.)
# refactor: Kodu yeniden düzenleme
# test: Test ekleme veya düzenleme
# chore: Yapılandırma değişiklikleri

echo -e "${YELLOW}Commit tipi seçin:${NC}"
echo "1) feat: Yeni özellik"
echo "2) fix: Hata düzeltmesi"
echo "3) docs: Dokümantasyon"
echo "4) style: Kod stili"
echo "5) refactor: Yeniden düzenleme"
echo "6) test: Test"
echo "7) chore: Yapılandırma"
read -p "Seçiminiz (1-7): " commit_type

case $commit_type in
    1) prefix="feat";;
    2) prefix="fix";;
    3) prefix="docs";;
    4) prefix="style";;
    5) prefix="refactor";;
    6) prefix="test";;
    7) prefix="chore";;
    *) prefix="misc";;
esac

# Commit mesajını al
read -p "Commit mesajını girin: " commit_message

# Commit at
echo -e "${YELLOW}Değişiklikler commit ediliyor...${NC}"
git commit -m "$prefix: $commit_message [$DATE]"

# backend-dev branch'ine push
echo -e "${YELLOW}Değişiklikler backend-dev branch'ine push ediliyor...${NC}"
git push origin backend-dev

# İşlem başarılı mesajı
echo -e "${GREEN}İşlem başarıyla tamamlandı!${NC}" 