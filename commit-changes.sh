#!/bin/bash

# Renklendirme için ANSI renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # Renk yok

echo -e "${GREEN}🔍 Değişiklikleri kontrol ediyorum...${NC}"

# Değişiklik olan dosyaları al
changed_files=$(git status --porcelain | grep -E "^(M| M|A| A|D| D)" | sed 's/^...//')

if [ -z "$changed_files" ]; then
    echo -e "${YELLOW}⚠️ Commit edilecek değişiklik bulunamadı.${NC}"
    exit 1
fi

echo -e "${GREEN}📝 Aşağıdaki dosyalarda değişiklik tespit edildi:${NC}"
echo "$changed_files" | nl

# Her dosya için ayrı commit mesajı al ve staged area'ya ekle
while IFS= read -r file; do
    if [ -n "$file" ]; then
        echo -e "\n${GREEN}📄 Dosya: ${YELLOW}$file${NC}"
        echo -e "${GREEN}Commit mesajını giriniz:${NC}"
        read -r commit_message
        
        # Dosyayı staged area'ya ekle
        git add "$file"
        
        # Commit mesajı ile commit et
        git commit -m "$commit_message"
        
        echo -e "${GREEN}✅ Commit başarıyla oluşturuldu: ${YELLOW}$commit_message${NC}"
    fi
done <<< "$changed_files"

echo -e "\n${GREEN}🚀 Tüm değişiklikler commit edildi. Push etmek ister misiniz? (E/H)${NC}"
read -r push_answer

if [[ $push_answer =~ ^[Ee]$ ]]; then
    echo -e "${GREEN}🔄 GitHub'a push ediliyor...${NC}"
    git push
    echo -e "${GREEN}✨ İşlem tamamlandı!${NC}"
else
    echo -e "${YELLOW}ℹ️ Push işlemi iptal edildi.${NC}"
fi 