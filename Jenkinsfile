pipeline {
    agent any

    tools {
        sonarRunner 'SonarScanner'
    }

    environment {
        IMAGE_NAME = "node-app"
        CONTAINERиққ_NAME = "node-app"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                        sonar-scanner \
                        -Dsonar.projectKey=node-app \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://sonarqube:9000
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true

                docker run -d \
                  --name $CONTAINER_NAME \
                  --network proxy \
                  -l "traefik.enable=true" \
                  -l "traefik.http.routers.node.rule=Host(`node-app.home`)" \
                  -l "traefik.http.routers.node.entrypoints=websecure" \
                  -l "traefik.http.routers.node.tls=true" \
                  -l "traefik.http.services.node.loadbalancer.server.port=3000 " \
                  $IMAGE_NAME
                '''
            }
        }
    }
}
