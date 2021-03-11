// Measuring disk I/O performance with mongoperf


//the mongoperf utility is in the bin directory MongoDB installation. 


1.  Measure the read throughput with Memory Maped Files (mmf) disabled:

mongoperf {	recSizeKB:	8,	nThreads:	12,	fileSizeMB:	10000,	r:	true,	mmf:	false	}

root@ubuntu:~# echo "{ recSizeKB: 8, nThreads: 12, fileSizeMB: 10000, r: true, 


You will get the following result:

mongoperf use -h for help parsed options:
{ recSizeKB: 8, nThreads: 12, fileSizeMB: 10000, r: true, mmf: false }
creating test file size:10000MB ...
1GB...
2GB...
3GB...
4GB...
5GB...
6GB...
7GB...
8GB...
9GB... testing...
options:{ recSizeKB: 8, nThreads: 12, fileSizeMB: 10000, r: true, mmf: false }
wthr 12
new thread, total running : 1 read:1 write:0
19789  ops/sec 77   MB/sec
19602  ops/sec 76   MB/sec
19173  ops/sec 74   MB/sec
19300  ops/sec 75   MB/sec
18838  ops/sec 73   MB/sec
19494  ops/sec 76   MB/sec
19579  ops/sec 76   MB/sec
19002  ops/sec 74   MB/sec
new thread, total running : 2
<---- output truncated --->
new thread, total running : 12 read:1 write:0
read:1 write:0 read:1 write:0 read:1 write:0
40544  ops/sec 158  MB/sec
40237  ops/sec 157  MB/sec
40463  ops/sec 158  MB/sec
40463  ops/sec 158  MB/sec


2.  In another Terminal window, run iostat to confirm the disk utilization as follows: 

 

3.  Measure the read throughput with mmf enabled and a payload larger than the server's total memory shown as follows:

root@ubuntu:~# echo "{ recSizeKB: 8, nThreads: 12, fileSizeMB: 10000, r: true, 


The following result is obtained:

mongoperf
 use -h for help
 parsed options:
 { recSizeKB: 8, nThreads: 12, fileSizeMB: 10000, r: true, mmf: true }
 creating test file size:10000MB ...
 1GB...
 2GB...
 3GB...
 4GB...
 5GB...
 6GB...
 7GB...
 8GB...
 9GB...
 testing...
 options:{ recSizeKB: 8, nThreads: 12, fileSizeMB: 10000, r: true, mmf: true }
 wthr 12
 new thread, total running : 1
 read:1 write:0
 8107  ops/sec
 9253  ops/sec
 9258  ops/sec
 9290  ops/sec
 9088  ops/sec
 <---- output truncated --->
 new thread, total running : 12
 read:1 write:0
 read:1 write:0
 read:1 write:0
 read:1 write:0
 9430  ops/sec
 9668  ops/sec
 9804  ops/sec
 9619  ops/sec
 9371  ops/sec


4.  Measure the read throughput with mmf enabled and a payload slightly less than the systems total memory:

root@ubuntu:~# echo "{  recSizeKB: 8, nThreads: 12, fileSizeMB: 400, r: true, mm


You will see the following: 
mongoperf
 use -h for help
 parsed options:
 { recSizeKB: 8, nThreads: 12, fileSizeMB: 400, r: true, mmf: true }
 creating test file size:400MB ...
 testing...
 options:{ recSizeKB: 8, nThreads: 12, fileSizeMB: 400, r: true, mmf: true }
 wthr 12
 new thread, total running : 1
 read:1 write:0
 2605344  ops/sec
 4918429  ops/sec
 4720891  ops/sec
 4766924  ops/sec
 4693762  ops/sec
 4810953  ops/sec
 4785765  ops/sec
 4839164  ops/sec
 <---- output truncated --->
 new thread, total running : 12
 read:1 write:0
 read:1 write:0
 read:1 write:0
 read:1 write:0
 4835022  ops/sec
 4962848  ops/sec
 4945852  ops/sec
 4945882  ops/sec
 4970441  ops/sec 


How it works...


The mongoperf utility takes parameters in the form of a JSON file. We can either provide this configuration in the form of a file or simply pipe the configuration
to mongoperf's stdin. To view the available options of mongoperf simply run
mongoperf -h and obtain the following:

usage:
 mongoperf <  myjsonconfigfile
   {
     nThreads:<n>,     // number of threads (default 1)
     fileSizeMB:<n>,   // test file size (default 1MB)
     sleepMicros:<n>,  // pause for sleepMicros/nThreads between each  operation (defaul
     mmf:<bool>,       // if true do   i/o's via memory mapped files (default false)
     r:<bool>,         // do   reads (default false)
     w:<bool>,         // do   writes (default false)
     recSizeKB:<n>,    // size of each  write (default 4KB)
     syncDelay:<n>     // secs between fsyncs, like --syncdelay in mongod. (default 0/n
   }


In step 1, we pass a handful of parameters to mongoperf. Let's take a look at them:

recSizeKB: The size of each record that would be written or read from the sample dataset. In our example, we are using an 8 KB record size. nThreads: The number of concurrent threads performing the (read/write) operations. In our case, it is set to 12.
fileSizeMB: The size of the file to be read or written to. We are setting this to roughly 10 GB
r: By indicating r:true, we will only be performing read operations. You can use w:true to test write operations or both.
mmf: It is memory mapped file format. Disabling mmf causes mongoperf to
bypass the file buffer and perform the operation directly on the disk. In order to truly test the underlying physical I/O, we are disabling mmf by setting it to false. In the subsequent steps, we will set it to true.

As we fire up the mongoperf utility, mongoperf first tries to create a roughly 10
GB file on the disk. Once created, it starts one thread and slowly ramps up to 12 (nThreads). You can clearly see the increase in read operations per second as the number of threads increases. Depending on your disk's capabilities, you should 
expect to reach the maximum IOPS limit pretty soon. This can be observed, in step 2, by running the iostat command and observing the %util column. Once it reaches 100%, you can assume that the disk is peaking at its maximum operating limit.

In step 3, we run the same test but this time with mmf set to true. Here, we are attempting to test the benefits of memory mapping by not reading the data from memory and reading it from the physical disk instead. However, you can see that the performance is not as high as we would expect. In fact, it is drastically lower than the IOPS achieved when reading from disk. The primary reason is that our working file is 10 GB in size, whereas my VM's memory is only 1 GB. As the entire dataset cannot fit in memory, mongoperf has to routinely seek data from the disk. This is more suboptimal when the reads are random, and this can be
observed in the output. In step 4, we confirm our theory by running the test again but this time, with a fileSize of 400 MB, which is smaller than the available memory. As you can see, the number of IOPS is drastically higher than the previous run, confirming that it is extremely important that your working dataset fits in your system's memory.

So there you have it, a simple way to test your system's IOPS using the mongoperf utility. Although we only tested read operations, I would strongly
urge you to test write as well as read/write operations when testing your systems. Additionally, you should also perform mmf enabled tests to give you an idea of what would be an adequate sized working set that you can hold on a given
server. 