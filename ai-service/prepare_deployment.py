"""
Hugging Face Spaces Deployment Script
Bu script, AI servisini Hugging Face Spaces'e deploy etmek için gerekli adımları otomatikleştirir.
"""

import os
import shutil
from pathlib import Path

def create_deployment_folder():
    """Deployment için geçici klasör oluştur"""
    deploy_dir = Path("hf_deployment")
    
    # Eski klasörü sil
    if deploy_dir.exists():
        shutil.rmtree(deploy_dir)
    
    # Yeni klasör oluştur
    deploy_dir.mkdir()
    
    print(f"✅ Deployment klasörü oluşturuldu: {deploy_dir.absolute()}")
    return deploy_dir

def copy_files(deploy_dir):
    """Gerekli dosyaları kopyala"""
    files_to_copy = [
        "README.md",
        "app.py",
        "requirements.txt"
    ]
    
    for file in files_to_copy:
        src = Path(file)
        dst = deploy_dir / file
        
        if src.exists():
            shutil.copy2(src, dst)
            print(f"✅ Kopyalandı: {file}")
        else:
            print(f"❌ Bulunamadı: {file}")
    
    print(f"\n📁 Deployment dosyaları hazır: {deploy_dir.absolute()}")

def show_instructions(deploy_dir):
    """Deployment talimatlarını göster"""
    print("\n" + "="*60)
    print("🚀 HUGGING FACE SPACES DEPLOYMENT TALİMATLARI")
    print("="*60)
    
    print("\n📋 Adım 1: Hugging Face'e giriş yapın")
    print("   👉 https://huggingface.co/login")
    print("   Email: emineaycabasaran@gmail.com")
    
    print("\n📋 Adım 2: Yeni Space oluşturun")
    print("   👉 https://huggingface.co/spaces")
    print("   - 'Create new Space' butonuna tıklayın")
    print("   - Space name: konusarak-ogren-sentiment")
    print("   - License: MIT")
    print("   - SDK: Gradio")
    print("   - Hardware: CPU basic (ücretsiz)")
    
    print("\n📋 Adım 3: Dosyaları yükleyin")
    print(f"   👉 Şu klasördeki 3 dosyayı Space'e yükleyin:")
    print(f"   📁 {deploy_dir.absolute()}")
    print("   - README.md")
    print("   - app.py")
    print("   - requirements.txt")
    
    print("\n📋 Adım 4: Build sürecini bekleyin (2-5 dakika)")
    
    print("\n📋 Adım 5: Space URL'nizi kopyalayın")
    print("   Format: https://huggingface.co/spaces/emineaycabasaran/konusarak-ogren-sentiment")
    
    print("\n📋 Adım 6: Backend'e URL ekleyin")
    print("   Dosya: backend/MessageApi/appsettings.Production.json")
    print('   Değer: "AI_URL": "https://huggingface.co/spaces/emineaycabasaran/konusarak-ogren-sentiment"')
    
    print("\n" + "="*60)
    print("✨ Deployment dosyaları hazır! Yukarıdaki adımları takip edin.")
    print("="*60)

def main():
    print("\n🎭 Konuşarak Öğren - Hugging Face Deployment Hazırlık\n")
    
    # Deployment klasörü oluştur
    deploy_dir = create_deployment_folder()
    
    # Dosyaları kopyala
    copy_files(deploy_dir)
    
    # Talimatları göster
    show_instructions(deploy_dir)
    
    # Windows Explorer'da klasörü aç
    try:
        os.startfile(deploy_dir.absolute())
        print(f"\n📂 Deployment klasörü açıldı!")
    except:
        pass

if __name__ == "__main__":
    main()
