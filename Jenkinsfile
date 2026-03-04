pipeline {
    agent any

    environment {
        IMAGE_NAME = "node-app"
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
                docker stop node-app || true
                docker rm node-app || true
                docker run -d --name node-app \
                  --network proxy \
                  -l "traefik.enable=true" \
                  -l "traefik.http.routers.node.rule=Host(`node-app.home`)" \
                  -l "traefik.http.routers.node.entrypoints=websecure" \
                  -l "traefik.http.routers.node.tls=true" \
                  -l "traefik.http.services.node.loadbalancer.server.port=3000" \
                  node-app
                '''
            }
        }
    }
}
