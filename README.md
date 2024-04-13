## Start the app
### Server
1. ```cd server```
2. ```npm start```

### Client
1. ```cd client```
2. ```npm install```
3. ```npm run dev```

## Testing
* Login
    * username: test
    * email: test@example.com
    * password: 12345678
* Payment
    * Card number: 4242 4242 4242 4242
    * CVC: any 3 digits  
    * Date: any future date
    * Promotion code:  **PROMO20**
* You'll get a confirmation mail when you register as a new user with your email address and make an order.

---

## Beskrivning
I den här uppgiften skall man skapa en webbshop där det går att lägga en order och genomföra en betalning med integration med Stripe. 
Man skall kunna registrera sig och logga in. 

Användaren skall skapas som kund i Stripe samt att användarnamn/email och krypterat lösenord skall sparas i en JSON-fil på servern. 
Hantera inloggning med hjälp av cookies. 

Alla produkter hanteras genom Stripe. En validering av betalningen ska implementeras.
Vid godkänd validering skall ordern sparas i en JSON-fil på servern.

* Inloggning: Egenbyggd inloggning med cookie-session paketet.
* Backend: Node/Express
* Frontend: React/Typescript

Här hittar ni info om giltiga testkort på Stripe: https://stripe.com/docs/testing.

### Krav för godkänt:
1. Produkter ska listas på en sida. 
2. Produkter som visas och köps skall hämtas ifrån Stripe.
3. Det ska gå att lägga till produkter i en kundvagn.
4. Baserad på kundvagnen skall det gå att lägga en order genom Stripe.
5. Man skall kunna registrera sig som en användare i webbshoppen. Detta skall resultera i att en ”Customer” skapas i Stripe och användaren sparas i en JSON-fil. (samtliga lösenord skall sparas krypterade).
6. Man skall kunna logga in som kund. Den inloggade kunden (som även är sparad i Stripe) skall användas vid placering av order.
7. Man skall inte kunna placera en order om man inte är inloggad.
8. Samtliga placerade ordrar skall sparas till en lista i en JSON-fil.
9. Ordern får inte under några omständigheter sparas utan genomförd betalning! (dvs. Spara aldrig ett orderobjekt såvida ni inte fått bekräftelse tillbaka ifrån stripe att betalningen gått igenom). Ordern skall som minst innehålla information om ordernummer, datum, kund, produkter, totalpris och utlämningsställe.

### Krav för väl godkänt:
1. Alla punkter för godkänt är uppfyllda.
2. Det skall gå att ange en rabattkod för att få rabatt på sitt köp (Detta görs genom Stripe)
3. Man skall som inloggad kunna se sina lagda ordrar.
4. Innan man betalar behöver användaren fylla i sin adress och utifrån adressen välja ett utlämningsställe där paketet skall hämtas (PostNord API).
5. Vid godkänd order skall ett email skickas till kunden (SendGrid Email API).