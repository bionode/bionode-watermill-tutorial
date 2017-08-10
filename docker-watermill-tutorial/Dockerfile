# DOCKERFILE for bionode-watermill two-mappers example
FROM ubuntu:16.04
MAINTAINER Tiago F. Jesus, tiagojesus@medicina.ulisboa.pt

# INSTALL DEPENDENCIES

RUN apt-get update && apt-get install -y apt-transport-https 
RUN apt-get update && apt-get -y install \
    bzip2 \
    curl \
    g++ \
    gcc \
    git \
    gzip \
    libtbb-dev \
    make \
    npm \
    sudo \
    unzip \
    wget \
    zlib1g-dev \
    zsh \
&& rm -rf /var/lib/apt/lists/*

# INSTALL node.js version 7
RUN curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
RUN apt-get install -y nodejs

### BOWTIE2 INSTALL ###

WORKDIR /tmp/
RUN wget https://downloads.sourceforge.net/project/bowtie-bio/bowtie2/2.3.2/bowtie2-2.3.2-linux-x86_64.zip
RUN unzip bowtie2-2.3.2-linux-x86_64.zip
RUN mv bowtie2-2.3.2/bowtie2* /usr/bin/
RUN rm -rf bowtie2-2.3.2-linux-x86_64.zip bowtie2-2.3.2

### BWA INSTALL ###

RUN wget https://sourceforge.net/projects/bio-bwa/files/bwa-0.7.15.tar.bz2
RUN mkdir bwa && tar xf bwa-0.7.15.tar.bz2 -C bwa --strip-components=1
WORKDIR /tmp/bwa/
RUN make && mv bwa /usr/bin/
WORKDIR /tmp/
RUN rm -rf bwa-0.7.15.tar.bz2 bwa

### DOWNLOAD FASTQ-DUMP ###

RUN wget https://ftp-trace.ncbi.nlm.nih.gov/sra/sdk/2.8.2-1/sratoolkit.2.8.2-1-ubuntu64.tar.gz
RUN mkdir sratoolkit && tar xf sratoolkit.2.8.2-1-ubuntu64.tar.gz -C sratoolkit --strip-components=1 && mv sratoolkit/bin/fastdump* /usr/bin/
RUN rm -rf sratoolkit.2.8.2-1-ubuntu64.tar.gz sratoolkit

### INSTALL SAMTOOLS ###

RUN wget https://sourceforge.net/projects/samtools/files/samtools/1.4.1/samtools-1.4.1.tar.bz2
RUN mkdir samtools && tar jxf samtools-1.4.1.tar.bz2 -C samtools --strip-components=1
WORKDIR /tmp/samtools/
RUN ./configure --without-curses --disable-bz2 --disable-lzma
RUN make && mv samtools /usr/bin/
WORKDIR /tmp/
RUN rm -rf samtools-1.4.1.tar.bz2 samtools

### FINAL BLOCK ###

WORKDIR /home/bionode

# CLONE BIONODE-WATERMILL FROM GIT HUB
RUN git clone https://github.com/bionode/bionode-watermill.git

# CHANGE DIRECTORY TO BIONODE-WATERMILL
WORKDIR /home/bionode/bionode-watermill
RUN npm install
RUN npm install bionode-ncbi -g

# START zsh before using iteractive mode
RUN zsh
