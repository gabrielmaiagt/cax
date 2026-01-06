# 🔥 Firebase Setup - Passo a Passo

## ⚠️ IMPORTANTE
O sistema já está **100% configurado** para Firebase, falta apenas adicionar suas credenciais!

---

## 📋 Como Configurar

### 1️⃣ Criar Projeto Firebase

1. Acesse: https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Nome do projeto: `caixa-funnel-analytics` (ou outro nome)
4. Aceite os termos e clique em **"Continuar"**
5. Desative o Google Analytics (não é necessário) e clique em **"Criar projeto"**
6. Aguarde a criação e clique em **"Continuar"**

---

### 2️⃣ Ativar Firestore Database

1. No menu lateral, clique em **"Build" → "Firestore Database"**
2. Clique em **"Create database"** ou **"Criar banco de dados"**
3. Selecione **"Start in test mode"** (modo de teste)
4. Escolha a localização: **us-central** ou mais próxima do seu público
5. Clique em **"Enable"** ou **"Ativar"**

---

### 3️⃣ Obter Credenciais

1. No menu lateral, clique no **ícone de engrenagem ⚙️** → **"Project settings"**
2. Role até a seção **"Your apps"** ou **"Seus aplicativos"**
3. Clique no ícone **</> (Web app)**
4. Nome do app: `Funnel Analytics`
5. **NÃO** marque "Firebase Hosting"
6. Clique em **"Register app"** ou **"Registrar app"**
7. Copie as credenciais que aparecem (são 6 valores)

---

### 4️⃣ Adicionar Credenciais no Projeto

1. Abra o arquivo: `js/firebase-config.js`
2. Substitua os valores de placeholder pelas suas credenciais:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",  // Cole sua API Key aqui
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

3. Salve o arquivo

---

### 5️⃣ Configurar Regras de Segurança (Opcional)

1. No Firestore, clique na aba **"Rules"**
2. Cole as regras abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /analytics/events/items/{eventId} {
      allow create: if true;  // Qualquer um pode criar eventos
      allow read: if true;    // Qualquer um pode ler (para o admin)
      allow delete: if true;  // Qualquer um pode deletar (botão limpar)
    }
  }
}
```

3. Clique em **"Publish"** ou **"Publicar"**

> **⚠️ ATENÇÃO:** Essas regras são para desenvolvimento. Em produção, adicione autenticação!

---

## ✅ Testar

Após configurar:

1. **Recarregue** qualquer página do funil
2. Abra o **Console do Chrome** (F12)
3. Procure por: `📊 Analytics library loaded (Using Firebase 🔥)`
4. Se aparecer essa mensagem, está funcionando! 🎉

---

## 🔍 Verificar Dados no Firebase

1. Acesse o Firebase Console
2. Vá em **"Build" → "Firestore Database"**
3. Você verá a estrutura:
   ```
   analytics → events → items → [seus eventos]
   ```

---

## 🚨 Solução de Problemas

### "Analytics library loaded (Using localStorage)"
❌ Firebase não está configurado corretamente
- Verifique se as credenciais estão corretas
- Verifique se o Firestore está ativado

### "Error saving to Firebase"
❌ Problema nas regras de segurança
- Verifique as regras do Firestore
- Certifique-se de estar em "test mode"

### Página não carrega
❌ Erro no firebase-config.js
- Verifique se não há erros de sintaxe
- Certifique-se de que todas as credenciais foram preenchidas

---

## 💡 Dicas

- Use **modo de teste** para desenvolvimento
- Para produção, adicione **autenticação** no admin
- Configure **limite de leitura/escrita** no Firebase Console
- Monitore o **uso** em "Usage" no console

---

## 📞 Precisa de Ajuda?

Se encontrar problemas, me envie:
1. Mensagem de erro no console
2. Screenshot do Firebase Console
3. Conteúdo do firebase-config.js (sem as credenciais!)

Estou aqui para ajudar! 🚀
