pipeline {
    agent {
        docker { image 'node:6-alpine' }
    }
    stages {

        stage("Install") {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'node --version'
                sh 'npm -v'
                sh 'npm run build'
            }
        }
    }
}