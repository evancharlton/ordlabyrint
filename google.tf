variable "google_token" {
  default = ""
}

provider "google" {
  project = "ordspill"
  region  = "europe-west10"
}

resource "local_file" "default" {
  file_permission = "0644"
  filename        = "${path.module}/backend.tf"

  # You can store the template in a file and use the templatefile function for
  # more modularity, if you prefer, instead of storing the template inline as
  # we do here.

  # TODO: Can we source the bucket name from somewhere?
  content = <<-EOT
  terraform {
    backend "gcs" {
      prefix = "${var.repo.name}/terraform"
      bucket = "terraform-remote-backend-2180c2249d350f10"
    }
  }
  EOT
}
