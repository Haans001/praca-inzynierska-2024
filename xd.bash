# Krok 1: Utworzenie tunelu SSH
$ ssh -i "inzynierka-bastion-keypair.pem" -f -N -L 5432:production-kino-db042fb68.c1oe0uycak42.us-east-1.rds.amazonaws.com:5432 ec2-user@ec2-3-239-71-38.compute-1.amazonaws.com -v

# Krok 2: Połączenie z bazą danych
$ psql -h localhost -U postgres -p 5432 -d production_kino