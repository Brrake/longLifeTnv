package com.tnvacademy.tnvauth.controllers

import com.tnvacademy.tnvauth.dtos.LoginDTO
import com.tnvacademy.tnvauth.dtos.Message
import com.tnvacademy.tnvauth.dtos.RegisterDTO
import com.tnvacademy.tnvauth.models.LoginReturn
import com.tnvacademy.tnvauth.models.Role
import com.tnvacademy.tnvauth.models.User
import com.tnvacademy.tnvauth.repositories.RolesRepository
import com.tnvacademy.tnvauth.services.UserService
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.core.env.Environment
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Key
import java.util.*


@RestController
@RequestMapping("api")
class AuthController(
    private val userService: UserService,
    private val rolesRepository: RolesRepository,
    private val env: Environment,
) {
    //Scadenza token
    val expTimeInMinutes = env.getProperty("jwt.expInMinutes")?.toInt()
    //Secret di cryptaggio
    val secret = env.getProperty("jwt.secret")
    //Nome del cookie
    val cookieName = env.getProperty("jwt.cookieName")
    //Lista di ruoli da gestire
    /* N.B quando si aggiunge un ruolo */
    val rolesToAdd = listOf(
        Role(env.getProperty("role.admin").toString()),
        Role(env.getProperty("role.mod").toString()),
        Role(env.getProperty("role.user").toString())
    )

    //Inizializza database
    @GetMapping("init")
    fun init(): ResponseEntity<Any> {
        this.checkRolesTable()
        return ResponseEntity.ok("success")
    }

    //Registra un utente
    @PostMapping("register")
    fun register(@RequestBody body: RegisterDTO,request: HttpServletRequest):ResponseEntity<Any> {

        try {
            //Prendi il mio token dagli header della richiesta
            val myToken = request.getHeader("x-access-token")
                ?:return ResponseEntity.badRequest().body(Message("Token non valido!"))
            //Se il token ?? null o vuoto
            if(myToken == ""){
                return ResponseEntity.badRequest().body(Message("Token non valido!"))
            }
            //Assegna a decJwt il jwt decodificato
            val decJwt = Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(myToken)
            //Estrai l'id dell'utente
            val myID = decJwt.body.issuer.toInt()
            //Cerca l'utente nel database
            val user = this.userService.getById(myID)
                ?: return ResponseEntity.badRequest().body(Message("Utente non trovato!"))
            //Flag di controllo
            var isAdmin = false
            //Cicla nei ruoli dell'utente
            user.roles.forEach {
                //Se l'utente ha il ruolo di Amministratore modifica il flag di controllo
                if(it.name == env.getProperty("role.admin").toString()){
                    isAdmin = true
                }
            }
            //Se non ?? admin allora non pu?? registrare l'utente
            if(!isAdmin){
                return ResponseEntity.badRequest().body(Message("Non sei un docente!"))
            }
        } catch (e: JwtException) {
            return ResponseEntity.badRequest().body(Message("Jwt scaduto o non valido!"))
        }

        //Salva utente nel db con una lista di ruoli ruolo di utente
        val myRolesList = listOf(Role(3,env.getProperty("role.user").toString()))
        return try {
            //Eseguire controlli sui parametri ricevuti

            //Salva utente nel DB
            this.userService.save(this.createUser(body, myRolesList))

            ResponseEntity.ok("Utente creato con successo!")
        }catch (err:Error){
            ResponseEntity.badRequest().body(Message("Errore nella creazione"))
        }
    }

    @PostMapping("login")
    fun login(@RequestBody body: LoginDTO,request: HttpServletRequest, response: HttpServletResponse): ResponseEntity<Any> {
        try {
            //Se l'utente esiste vai avanti
            val user = this.userService.findByEmail(body.email)
                ?: return ResponseEntity.badRequest().body(Message("Utente non trovato!"))
            //Se la password combacia vai avanti
            if (!user.comparePassword(body.password)) {
                return ResponseEntity.badRequest().body(Message("Password errata!"))
            }

             val ipAddress = getClientIp(request);

            //Crea issuer per la creazione del jwt
            val issuer = user.id.toString()
            //Creazione jwt con una scadenza data da 'expTime' e il secret dato da 'secret'
            val jwt = Jwts.builder()
                .setIssuer(issuer)
                .setExpiration(Date(System.currentTimeMillis() +60 * expTimeInMinutes!! * 1000)) // 30 minutes
                .signWith(getSigningKey()).compact()
            /*
            //Creazione del cookie con nome 'cookieName' e valore di 'jwt'
            /          IPOTESI COOKIE

            val cookie = Cookie(cookieName, jwt)

            //Cookie security
            cookie.secure = false
            cookie.maxAge = 24 * 60 * 60;
            cookie.path = "/";
            cookie.isHttpOnly = true
            //Aggiunta del cookie alla risposta
            response.addCookie(cookie)
            */

           //Creazione della risposta con le credenziali da intercettare
           return ResponseEntity.ok(LoginReturn(jwt,user.name,user.email, user.roles))
       }catch (err:Error){
           return ResponseEntity.status(401).body(Message("Errore nel login"))
       }
   }
   private fun getSigningKey(): Key {
       val keyBytes = Decoders.BASE64.decode(secret)
       return Keys.hmacShaKeyFor(keyBytes)
   }

   /*
   @GetMapping("user")
   fun user(@RequestHeader("x-access-token") jwt: String): ResponseEntity<Any> {
       try {
           //Se il jwt ?? valido vai avanti
           if (jwt == null) {
               return ResponseEntity.status(401).body(Message("Non autenticato!"))
           }
           //Decrypta jwt - classi deprecate
           val body = Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(jwt).body
           //Estrai info utente
           val user = this.userService.getById(body.issuer.toInt())

           //Crea nuovo utente e salva ruolo
           val newUser = this.createUser(user, user.roles)

           return ResponseEntity.ok(newUser)
       } catch (e: Exception) {
           return ResponseEntity.status(401).body(Message("Non autenticato!"))
       }
   }

   @PostMapping("logout")
   fun logout(response: HttpServletResponse): ResponseEntity<Any> {
       //Cancella jwt
       /*
       val cookie = Cookie(cookieName, "")
       cookie.maxAge = 0
       cookie.path = "/"

       //Aggiungi cookie alla risposta
       response.addCookie(cookie)
       */

       return ResponseEntity.ok(Message("Logout effettuato"))
   }
   */
   private fun getClientIp(request: HttpServletRequest?): String? {
       var remoteAddr: String? = ""
       if (request != null) {
           remoteAddr = request.getHeader("X-FORWARDED-FOR")
           if (remoteAddr == null || "" == remoteAddr) {
               remoteAddr = request.remoteAddr
           }
       }
       return remoteAddr
   }
   fun checkRolesTable(){
       //Cerca i ruoli presenti nel database
       val roles = this.rolesRepository.findAll()
       //Se non ci sono ruoli allora inserisci quelli di default
       if(roles.size == 0){
           this.createRoles(rolesToAdd)
       }else{
           //Flag di controllo per verificare se esistono gi?? dei ruoli
           var existRole = false
           //Cicla intorno ai ruoli da aggiungere
           rolesToAdd.forEach{role->
               //Cicla intorno ai ruoli del DB
               roles.forEach{
                   //Se il ruolo da controllare ?? presente nel DB allora 'existRole' = true e questo ruolo non verr?? aggiunto
                   if(it.name == role.name) {
                       existRole=true
                   }
               }
               //Se il ruolo non esiste allora aggiungilo al DB
               if(!existRole){
                   val newList = listOf(Role(role.name))
                   this.createRoles(newList)
               }else{
                   //Se il ruolo esiste allora vai avanti con il ciclo e resetta lo stato del flag
                   existRole=false
               }
           }

       }
   }
   fun createRoles(roles:List<Role>){
       roles.forEach {
           this.rolesRepository.save(it)
       }
   }
   fun createUser(user:User,myRoles:List<Role>):User{
       //Crea utente basato su quello esistente
       return User(user.id,user.name,user.email,listOf(Role(myRoles[0].id,myRoles[0].name)),user.password)
   }
   fun createUser(user:RegisterDTO,myRoles:List<Role>):User{
       //Crea nuovo utente e salva ruolo
       return User(user.name,user.email,listOf(Role(myRoles[0].id,myRoles[0].name)),user.password)
   }
}