pipeline {
    agent any

    environment {
        IMAGE_NAME = "node-app"
	IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

	stage('SonarQube Scan') {
	    steps {
	        script {
	            def scannerHome = tool 'SonarScanner'
	            withSonarQubeEnv('SonarQube') {
	                sh """
	                    ${scannerHome}/bin/sonar-scanner \
	                    -Dsonar.projectKey=node-app \
	                    -Dsonar.sources=. \
	                    -Dsonar.host.url=http://sonarqube:9000
	                """
	            }
	        }
	    }
	}	

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

	stage('Deploy') {
	    steps {
	        sh """
	        docker stop node-app || true
	        docker rm node-app || true
	        docker run -d --name node-app \
	          --restart unless-stopped \
	          --network proxy \
	          -l 'traefik.enable=true' \
	          -l 'traefik.http.routers.node.rule=Host("node-app.siddarthan.dpdns.org")' \
	          -l 'traefik.http.routers.node.entrypoints=web' \
	          -l 'traefik.http.services.node.loadbalancer.server.port=3000' \
	          ${IMAGE_NAME}:${IMAGE_TAG}
	        """
	    }
	}

	stage('Cleanup') {
            steps {
                sh """
                docker image prune -f
                docker container prune -f
                docker builder prune -f
                """
            }
        }

    }

    post {
        success {
            echo "Pipeline Success 🚀"
        }

        failure {
            echo "Pipeline Failed ❌"
        }
    }
}
