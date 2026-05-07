# Entregables CICD

# Ejercicios Jenkins

## 1. CI/CD de una Java + Gradle

En el directorio raíz de este [código fuente](https://github.com/Lemoncode/bootcamp-devops-lemoncode/tree/master/03-cd/exercises/jenkins-resources), crea un Jenkinsfile que contenga una pipeline declarativa con los siguientes stages:

- **Checkout**. Descarga de código desde un repositorio remoto, preferentemente utiliza GitHub.
- **Compile**. Compilar el código fuente utilizando gradlew compileJava.
- **Unit Tests**. Ejecutar los test unitarios utilizando gradlew test.

Para ejecutar Jenkins en local y tener las dependencias necesarias disponibles podemos construir una imagen a partir de este [Dockerfile](https://github.com/Lemoncode/bootcamp-devops-lemoncode/blob/master/03-cd/exercises/jenkins-resources/gradle.Dockerfile)

**Solución**:

Levantamos Jenkins con el Dockerfile de Grandle:

```bash
# Construir la imagen
docker build -t jenkins-gradle -f ./Ejercicios_Jenkins_1/gradle.Dockerfile .

# He tenido que cambiar el valor de GRADLE_SHA al utilizar la versión 7.6.6

# Levantar el contenedor
docker run -d -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  --name jenkins-gradle \
  jenkins-gradle
```

Seguimos los primeros pasos y ya tenemos nuestro Jenkins disponible:

![Jenkins_disponible](./Ejercicios_Jenkins_1/images/Jenkins_disponible.png)

Creamos nueva tarea de tipo `Pipeline`:

![Nueva_tarea_pipeline](./Ejercicios_Jenkins_1/images/Nueva_tarea_pipeline.png)

En la configuración de la pipeline seteamos los siguientes campos:

  - Definition: Pipeline script from SCM (esto ya clona el repositorio)
  - SCM: Git
  - Repository URL: https://github.com/GeerDev/Entregables_CICD
  - Branch: */main
  - Script Path: Ejercicios_Jenkins_1/Jenkinsfile

Le damos a ejecutar la pipeline, comprobamos que todo ha ido bien, que ha descargado el código, que lo ha compilado y ha corrido los tests:

![Primera_build](./Ejercicios_Jenkins_1/images/Primera_build.png)

## 2. Modificar la pipeline para que utilice la imagen Docker de Gradle como build runner

- Utilizar Docker in Docker a la hora de levantar Jenkins para realizar este ejercicio.
- Como plugins deben estar instalados Docker y Docker Pipeline.
- Usar la imagen de Docker gradle:6.6.1-jre14-openj9.

**Solución**:

Paramos y eliminamos el contenedor actual:

```bash
docker stop jenkins-gradle
docker rm jenkins-gradle
```

Levantamos Jenkins con el socket de Docker montado (DinD):

```bash
docker run -d -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --name jenkins-dind \
  jenkins/jenkins
```

En la configuración de la pipeline seteamos los siguientes campos:

  - Definition: Pipeline script from SCM (esto ya clona el repositorio)
  - SCM: Git
  - Repository URL: https://github.com/GeerDev/Entregables_CICD
  - Branch: */main
  - Script Path: Ejercicios_Jenkins_2/Jenkinsfile

Vemos ahora en los logs del console output del build que efectivamente se está utilizando Docker:



Comprobamos que todo que la build se ha ejecutado con éxito y que se han cumplido todos los pasos:



Esto nos da más libertad ,por ejemplo, si el día de mañana tuvieramos 10 proyectos con versiones distintas de Gradle, necesitas 10 imágenes distintas de Jenkins en el caso de no utilizar Docker, ahora no necesitamos que la imagen de Jenkins contenga lo que queramos utilizar, directamente en el agent del Jenkinsfile ganamos la flexibilidad de poder utilizar lo que queramos.

# Ejercicios GitHub Actions

## 1. Crea un workflow CI para el proyecto de frontend - OBLIGATORIO

Copia el directorio [.start-code/hangman-front](https://github.com/Lemoncode/bootcamp-devops-lemoncode/tree/master/03-cd/03-github-actions/.start-code/hangman-front) en el directorio raíz del mismo repositorio que usaste para las clases de GitHub Actions. Si no lo creaste, crea un repositorio nuevo.

Después crea un nuevo workflow que se dispare cuando haya cambios en el proyecto hangman-front y exista una nueva pull request (deben darse las dos condiciones a la vez). El workflow ejecutará las siguientes operaciones:

- Build del proyecto de front
- Ejecutar los unit tests

## 2. Crea un workflow CD para el proyecto de frontend - OBLIGATORIO

Crea un nuevo workflow que se dispare manualmente y haga lo siguiente:

- Crear una nueva imagen de Docker
- Publicar dicha imagen en el [container registry de GitHub](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

## 3. Crea un workflow que ejecute tests e2e - OPCIONAL

Crea un workflow que se lance de la manera que elijas y ejecute los tests e2e que encontrarás en [este enlace](https://github.com/Lemoncode/bootcamp-devops-lemoncode/tree/master/03-cd/03-github-actions/.start-code/hangman-e2e/e2e). Puedes usar [Docker Compose](https://docs.docker.com/compose/gettingstarted/) o [Cypress action](https://github.com/cypress-io/github-action) para ejecutar los tests.

**Como ejecutar los tests e2e**
- Tanto el front como la api se deben estar corriendo

```bash
docker run -d -p 3001:3000 hangman-api
docker run -d -p 8080:8080 -e API_URL=http://localhost:3001 hangman-front
```

- Los tests se ejecutan desde el directorio hangman-e2e/e2e haciendo uso del comando npm run open

```bash
cd hangman-e2e/e2e
npm run open
```

## 4. Crea una custom JavaScript Action - OPCIONAL

Crea una custom JavaScript Action que se ejecute cada vez que una issue tenga la etiqueta motivate. La acción deberá pintar por consola un mensaje motivacional. Puedes usar esta [API](https://favqs.com/api) gratuita. Puedes encontrar más información de como crear una custom JS action en [este enlace](https://docs.github.com/es/actions/tutorials/create-actions/create-a-javascript-action).

```bash
curl https://favqs.com/api/qotd
```