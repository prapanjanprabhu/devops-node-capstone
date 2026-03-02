pipeline {
  agent any

  environment {
    DOCKERHUB_USER = "prapanjanprabhu"
    IMAGE_NAME     = "${DOCKERHUB_USER}/devops-node-capstone"
    APP_HOST       = "35.154.72.81"
    SSH_CRED       = "app-ec2-ssh"
    DOCKER_CRED    = "dockerhub-user"
  }

  stages {

    stage("Checkout") {
      steps {
        checkout scm
      }
    }



    stage("Build Docker Image") {
      steps {
        sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest ."
      }
    }

    stage("Docker Login & Push") {
      steps {
        withCredentials([usernamePassword(credentialsId: DOCKER_CRED, usernameVariable: 'U', passwordVariable: 'P')]) {
          sh """
            echo \$P | docker login -u \$U --password-stdin
            docker push ${IMAGE_NAME}:${BUILD_NUMBER}
            docker push ${IMAGE_NAME}:latest
          """
        }
      }
    }

    stage("Deploy to App EC2") {
      steps {
        sshagent([SSH_CRED]) {
          sh """
            ssh -o StrictHostKeyChecking=no ubuntu@${APP_HOST} '
              docker pull ${IMAGE_NAME}:latest &&
              docker stop capstone-app || true &&
              docker rm capstone-app || true &&
              docker run -d --name capstone-app --restart unless-stopped -p 80:3000 ${IMAGE_NAME}:latest &&
              docker ps
            '
          """
        }
      }
    }
  }

  post {
    always {
      sh "docker logout || true"
    }
  }
}