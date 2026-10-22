(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var nf=new Intl.NumberFormat('id-ID');
var rp=function(n){return 'Rp '+nf.format(Math.round(n))};
var store={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
function tween(el,to,fmt){
  var from=parseFloat(el.dataset.v)||0;el.dataset.v=to;
  if(reduce||from===to){el.textContent=fmt(to);return}
  var t0=performance.now(),dur=550;cancelAnimationFrame(el._r);
  (function step(t){var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=fmt(from+(to-from)*e);if(p<1)el._r=requestAnimationFrame(step)})(t0);
}

/* ---------- theme ---------- */
var root=document.documentElement,tb=$('#themeBtn');
var sun='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
var moon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
function curTheme(){return root.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}
function paintTheme(){tb.innerHTML=curTheme()==='dark'?sun:moon}
var saved=store.get('pt-theme');if(saved==='dark'||saved==='light')root.setAttribute('data-theme',saved);
paintTheme();
tb.addEventListener('click',function(){var n=curTheme()==='dark'?'light':'dark';root.setAttribute('data-theme',n);store.set('pt-theme',n);paintTheme()});

/* ---------- plates ---------- */
var SEG=[
 {id:'pokok',name:'Makanan pokok',pct:33,why:'Sumber energi utama. Gonta-ganti jenisnya agar menu tidak membosankan dan lebih beragam.',foods:['Nasi','Jagung','Singkong','Ubi jalar','Kentang','Sagu'],tip:'Selang-seling nasi dengan ubi jalar atau jagung 2 sampai 3 kali seminggu untuk tambahan serat dan variasi.'},
 {id:'lauk',name:'Lauk pauk',pct:17,why:'Pembangun tubuh. Utamakan protein hewani untuk anak, lalu padukan dengan tempe dan tahu.',foods:['Telur','Ikan kembung','Ayam','Hati ayam','Tempe','Tahu','Kacang hijau'],tip:'Satu butir telur sehari sudah menambah protein berkualitas dengan harga yang terjangkau.'},
 {id:'buah',name:'Buah',pct:17,why:'Pelengkap vitamin, mineral, dan serat. Pilih yang sedang musim karena harganya lebih murah.',foods:['Pepaya','Pisang','Jeruk','Jambu biji','Semangka'],tip:'Buah utuh lebih baik daripada jus karena seratnya tetap terjaga.'},
 {id:'sayur',name:'Sayuran',pct:33,why:'Pengatur tubuh. Pilih aneka warna: hijau, oranye, dan ungu agar zat gizinya beragam.',foods:['Bayam','Kangkung','Daun kelor','Wortel','Buncis','Labu siam','Daun singkong'],tip:'Masak sebentar saja supaya vitamin tidak banyak hilang oleh panas dan air.'}
];
function plateSVG(interactive){
  var start=0,rings='',labels='';
  SEG.forEach(function(s,i){
    var d=(s.pct-1.4).toFixed(2),off=-(start+0.7);
    rings+='<circle class="seg" data-i="'+i+'" cx="200" cy="200" r="100" pathLength="100" fill="none" stroke="var(--c-'+s.id+')" stroke-width="112" stroke-dasharray="'+d+' 100" stroke-dashoffset="'+off+'" style="--delay:'+(0.2+i*0.14)+'s"'+(interactive?' tabindex="0" role="button" aria-label="'+s.name+', '+s.pct+' persen"':'')+'/>';
    var a=((start+s.pct/2)/100)*2*Math.PI-Math.PI/2;
    labels+='<text x="'+(200+100*Math.cos(a)).toFixed(1)+'" y="'+(200+100*Math.sin(a)+7).toFixed(1)+'" text-anchor="middle" font-size="22">'+s.pct+'%</text>';
    start+=s.pct;
  });
  return '<circle cx="200" cy="200" r="196" fill="var(--plate)" stroke="var(--line)" stroke-width="2"/>'+
    '<circle class="halo" cx="200" cy="200" r="184" fill="none" stroke="var(--line)" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>'+
    '<circle cx="200" cy="200" r="166" fill="var(--plate-in)"/>'+
    '<g transform="rotate(-90 200 200)">'+rings+'</g>'+labels+
    '<circle id="'+(interactive?'ctr':'ctr0')+'" cx="200" cy="200" r="40" fill="var(--plate)" stroke="var(--line)" stroke-width="2"/>'+
    '<text id="'+(interactive?'ctrT':'ctrT0')+'" x="200" y="'+(interactive?'196':'206')+'" text-anchor="middle" font-size="'+(interactive?'11':'12')+'">'+(interactive?'ISI':'PIRING')+'</text>'+
    (interactive?'<text id="ctrS" x="200" y="214" text-anchor="middle" font-size="11">PIRINGKU</text>':'');
}
var hs=document.createElementNS('http://www.w3.org/2000/svg','svg');
hs.setAttribute('class','plate');hs.setAttribute('viewBox','0 0 400 400');hs.setAttribute('role','img');hs.setAttribute('aria-label','Piring gizi seimbang: makanan pokok 33 persen, lauk 17 persen, buah 17 persen, sayur 33 persen');
hs.innerHTML=plateSVG(false);$('#heroPlate').insertBefore(hs,$('#heroPlate').firstChild);

var big=$('#bigPlate');big.innerHTML=plateSVG(true);
var detail=$('#detail');
function selectSeg(i){
  var s=SEG[i];
  $$('.seg',big).forEach(function(c,k){c.classList.toggle('on',k===i)});
  big.classList.add('has-sel');
  $('#ctrT').textContent=s.name.split(' ')[0].toUpperCase();
  $('#ctrS').textContent=(s.name.split(' ')[1]||'').toUpperCase();
  detail.innerHTML='<div class="detail-in"><div class="pct" style="color:var(--c-'+s.id+')">'+s.pct+'%</div><h3>'+s.name+'</h3><p class="why">'+s.why+'</p><ul class="tags">'+s.foods.map(function(f){return '<li>'+f+'</li>'}).join('')+'</ul><div class="tip"><b>Tips hemat:</b> '+s.tip+'</div></div>';
}
$$('.seg',big).forEach(function(c){
  var i=+c.getAttribute('data-i');
  c.addEventListener('click',function(){selectSeg(i)});
  c.addEventListener('mouseenter',function(){selectSeg(i)});
  c.addEventListener('focus',function(){selectSeg(i)});
  c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectSeg(i)}});
});
selectSeg(1);
$$('.dots').forEach(function(d){var n=+d.dataset.n,h='';for(var i=0;i<n;i++)h+='<i style="--i:'+i+'"></i>';d.innerHTML=h});

/* ---------- ticker ---------- */
var tk=['Tempe','Ikan kembung','Bayam','Telur','Daun kelor','Pepaya','Ubi jalar','Kacang hijau','Ikan teri','Jagung','Tahu','Labu siam'];
var th=tk.map(function(t){return '<span>'+t+'</span>'}).join('');
$('#ticker').innerHTML=th+th;

/* ---------- count up ---------- */
var io=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return;io.unobserve(e.target);var el=e.target;
  var to=parseFloat(el.dataset.count),dec=+el.dataset.dec,fmt=new Intl.NumberFormat('id-ID',{minimumFractionDigits:dec,maximumFractionDigits:dec});
  if(reduce){el.textContent=fmt.format(to);return}
  var t0=performance.now();(function s(t){var p=Math.min(1,(t-t0)/1400),v=to*(1-Math.pow(1-p,4));el.textContent=fmt.format(v);if(p<1)requestAnimationFrame(s)})(t0);
})},{threshold:.6});
$$('[data-count]').forEach(function(el){
  var r=el.getBoundingClientRect();
  if(r.top>innerHeight||r.bottom<0){el.textContent='0';io.observe(el)}
});

/* ---------- nav highlight ---------- */
var links=$$('.links a'),map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
var nio=new IntersectionObserver(function(es){es.forEach(function(e){
  if(e.isIntersecting){links.forEach(function(a){a.classList.remove('on')});var a=map[e.target.id];if(a){a.classList.add('on');var box=a.parentNode;if(box.scrollWidth>box.clientWidth){box.scrollLeft=a.offsetLeft-(box.clientWidth-a.offsetWidth)/2}}}
})},{rootMargin:'-40% 0px -55% 0px'});
Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)nio.observe(s)});

/* ---------- reveal (one-time, below-the-fold only) ---------- */
if(!reduce){
  var rio=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target)}
  })},{rootMargin:'0px 0px -8% 0px'});
  $$('.reveal').forEach(function(el){
    var r=el.getBoundingClientRect();
    if(r.top>innerHeight*0.92){el.classList.add('pre');rio.observe(el)}
  });
}

/* ---------- calculator ---------- */
var GR=[
 {id:'bayi',l:'Bayi 6–11 bulan',k:800,p:15,v:100},
 {id:'balita',l:'Balita 1–3 tahun',k:1350,p:20,v:200},
 {id:'pra',l:'Anak 4–6 tahun',k:1400,p:25,v:250},
 {id:'sd',l:'Anak 7–9 tahun',k:1650,p:40,v:300},
 {id:'rem',l:'Remaja 13–18 tahun',k:2300,p:68,v:400},
 {id:'pria',l:'Dewasa pria 19–49',k:2600,p:65,v:400},
 {id:'wan',l:'Dewasa wanita 19–49',k:2200,p:60,v:400},
 {id:'ham',l:'Ibu hamil (tri. 2–3)',k:2500,p:80,v:400},
 {id:'sus',l:'Ibu menyusui',k:2550,p:77,v:400},
 {id:'lan',l:'Lansia 65+',k:1700,p:61,v:350}
];
var cnt={bayi:0,balita:1,pra:0,sd:1,rem:0,pria:1,wan:1,ham:0,sus:0,lan:0};
var cols=['var(--c-sayur)','var(--c-pokok)','var(--c-lauk)','var(--c-buah)','var(--accent)','var(--sun)'];
var PR=[
 {id:'beras',l:'Beras',u:'kg',p:14000,f:function(T){return T.k*0.5*7/3600}},
 {id:'telur',l:'Telur',u:'butir',p:2300,f:function(T){return T.p*0.5*0.25*7/6}},
 {id:'ikan',l:'Ikan',u:'kg',p:38000,f:function(T){return T.p*0.5*0.25*7/0.18/1000}},
 {id:'tempe',l:'Tempe dan tahu',u:'kg',p:22000,f:function(T){return T.p*0.5*0.5*7/0.19/1000}},
 {id:'sayur',l:'Sayuran',u:'kg',p:16000,f:function(T){return T.v*2/3*7/1000}},
 {id:'buah',l:'Buah',u:'kg',p:22000,f:function(T){return T.v/3*7/1000}}
];
var mem=$('#members');
mem.innerHTML=GR.map(function(g){return '<div class="member" id="m-'+g.id+'"><div class="lbl"><b>'+g.l+'</b><small>'+nf.format(g.k)+' kkal</small></div><div class="step"><button type="button" data-g="'+g.id+'" data-d="-1" aria-label="Kurangi '+g.l+'">−</button><output id="n-'+g.id+'" aria-live="polite">0</output><button type="button" data-g="'+g.id+'" data-d="1" aria-label="Tambah '+g.l+'">+</button></div></div>'}).join('');
$('#rows').innerHTML=PR.map(function(r){return '<div class="row"><b>'+r.l+'</b><span class="qty" id="q-'+r.id+'">0</span><label class="price" for="p-'+r.id+'">Rp<input id="p-'+r.id+'" type="number" inputmode="numeric" min="0" step="100" value="'+r.p+'" aria-label="Harga '+r.l+' per '+r.u+'"><span>/'+r.u+'</span></label><span class="sub" id="s-'+r.id+'">Rp 0</span></div>'}).join('');
mem.addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b)return;
  var id=b.dataset.g;cnt[id]=Math.max(0,Math.min(10,cnt[id]+(+b.dataset.d)));calc();
});
$('#rows').addEventListener('input',calc);
function calc(){
  var T={k:0,p:0,v:0,n:0},parts=[];
  GR.forEach(function(g,i){
    var c=cnt[g.id];$('#n-'+g.id).textContent=c;$('#m-'+g.id).classList.toggle('has',c>0);
    T.k+=g.k*c;T.p+=g.p*c;T.v+=g.v*c;T.n+=c;
    if(c>0)parts.push({l:g.l,c:c,k:g.k*c,col:cols[parts.length%cols.length]});
  });
  tween($('#kcal'),T.k,function(v){return nf.format(Math.round(v))});
  tween($('#prot'),T.p,function(v){return nf.format(Math.round(v))});
  $('#share').innerHTML=parts.map(function(p){return '<i style="flex-grow:'+p.k+';background:'+p.col+'" title="'+p.l+'"></i>'}).join('');
  $('#legend').innerHTML=parts.length?parts.map(function(p){return '<li><i style="background:'+p.col+'"></i>'+p.c+' × '+p.l+'</li>'}).join(''):'<li>Tambahkan anggota keluarga untuk melihat hasil.</li>';
  var total=0;
  PR.forEach(function(r){
    var q=T.n?r.f(T):0,price=parseFloat($('#p-'+r.id).value)||0,sub=q*price;total+=sub;
    var shown=r.u==='butir'?Math.round(q):Math.round(q*10)/10;
    $('#q-'+r.id).textContent=nf.format(shown)+' '+r.u;
    $('#s-'+r.id).textContent=rp(sub);
  });
  tween($('#tot'),total,rp);
  $('#perhead').textContent=T.n?('≈ '+rp(total/7/T.n)+' per orang per hari'):'';
}
calc();

/* ---------- self-check ---------- */
var QS=['Anda khawatir tidak punya cukup makanan.','Anda tidak bisa makan makanan yang sehat dan bergizi.','Anda hanya makan beberapa jenis makanan saja.','Anda harus melewatkan waktu makan.','Anda makan lebih sedikit dari yang seharusnya.','Rumah Anda kehabisan makanan.','Anda merasa lapar tetapi tidak makan.','Anda tidak makan seharian.'];
$('#qs').innerHTML=QS.map(function(q,i){var n=i+1;return '<fieldset class="q"><legend>'+q+'</legend><p>'+n+'. '+q+'</p><div class="yn"><input type="radio" id="q'+n+'y" name="q'+n+'" value="1"><label for="q'+n+'y">Ya</label><input class="no" type="radio" id="q'+n+'n" name="q'+n+'" value="0"><label for="q'+n+'n">Tidak</label></div></fieldset>'}).join('');
var LV=[
 {max:0,c:'var(--ok)',t:'Aman',d:'Rumah Anda tidak melaporkan kesulitan pangan. Pertahankan dengan menjaga variasi menu dan menyimpan cadangan bahan pokok.',s:['Susun menu mingguan agar belanja tetap hemat.','Simpan beras dan bahan kering untuk dua minggu.','Ajak tetangga berbagi hasil kebun atau resep murah.']},
 {max:3,c:'var(--warn)',t:'Waspada',d:'Ada tanda tekanan pada akses pangan. Ini saat yang baik untuk memperkuat dapur sebelum keadaan memburuk.',s:['Pakai kalkulator di atas untuk merencanakan belanja pekan depan.','Tanam kangkung, bayam, atau cabai di pot atau pekarangan.','Tanyakan kader Posyandu atau RT tentang program pangan setempat.']},
 {max:6,c:'var(--risk)',t:'Rawan sedang',d:'Kebutuhan pangan sering tidak terpenuhi. Dahulukan anak, ibu hamil, dan lansia, lalu cari dukungan.',s:['Datangi kantor desa atau kelurahan untuk menanyakan bantuan sosial pangan dan kelayakannya.','Periksakan berat dan tinggi anak ke Posyandu atau Puskesmas.','Utamakan telur, tempe, dan sayur sebagai sumber gizi termurah.']},
 {max:8,c:'var(--bad)',t:'Rawan berat',d:'Rumah Anda sangat kekurangan pangan. Segera minta bantuan, Anda tidak perlu menghadapinya sendirian.',s:['Hubungi kelurahan, Dinas Sosial, atau Puskesmas hari ini.','Minta bantuan tetangga, RT/RW, tempat ibadah, atau relawan pangan.','Pastikan anak, ibu hamil, dan lansia mendapat makan lebih dulu.']}
];
function evalCheck(){
  var ans=0,yes=0;
  for(var n=1;n<=8;n++){var c=$('input[name=q'+n+']:checked');if(c){ans++;yes+=+c.value}}
  var cells=$$('#meter i'),lv=LV.filter(function(l){return yes<=l.max})[0];
  if(ans<8){
    cells.forEach(function(c,i){c.className=i<ans?'f':'';c.style.background=i<ans?'var(--muted)':''});
    $('#score').textContent=ans+' dari 8 terjawab';$('#lvl').textContent='Jawab semua pertanyaan';$('#lvl').style.color='';
    $('#desc').textContent='Dalam 12 bulan terakhir, apakah hal-hal berikut terjadi pada Anda atau anggota rumah karena kekurangan uang atau sumber daya lain?';
    $('#steps').innerHTML='';return;
  }
  cells.forEach(function(c,i){c.className=i<yes?'f':'';c.style.background=i<yes?lv.c:''});
  $('#score').textContent=yes+' dari 8 jawaban "Ya"';$('#lvl').textContent=lv.t;$('#lvl').style.color=lv.c;
  $('#desc').textContent=lv.d;$('#steps').innerHTML=lv.s.map(function(x){return '<li>'+x+'</li>'}).join('');
}
$('#qs').addEventListener('change',evalCheck);

/* ---------- local foods ---------- */
var NUT=['Protein','Zat besi','Vitamin A','Kalsium','Serat'];
var FD=[
 {n:'Telur ayam',t:'Protein lengkap yang murah dan mudah dimasak. Cocok untuk MPASI dan sarapan.',g:['Protein','Vitamin A'],c:'--c-lauk'},
 {n:'Tempe',t:'Hasil fermentasi kedelai. Kaya protein dan serat, harganya bersahabat.',g:['Protein','Serat','Zat besi'],c:'--c-pokok'},
 {n:'Tahu',t:'Mudah diolah untuk semua usia. Tahu yang diendapkan kalsium ikut menyumbang kalsium.',g:['Protein','Kalsium'],c:'--c-pokok'},
 {n:'Ikan kembung',t:'Ikan laut yang terjangkau, sumber protein dan lemak sehat.',g:['Protein'],c:'--c-lauk'},
 {n:'Ikan teri',t:'Dimakan utuh dengan tulangnya, jadi sumber kalsium yang baik.',g:['Kalsium','Protein'],c:'--c-lauk'},
 {n:'Hati ayam',t:'Sangat kaya zat besi dan vitamin A. Cukup sedikit, dua kali seminggu.',g:['Zat besi','Vitamin A','Protein'],c:'--c-lauk'},
 {n:'Daun kelor',t:'Tumbuh di pekarangan hampir tanpa perawatan. Padat zat besi dan kalsium.',g:['Zat besi','Kalsium','Vitamin A'],c:'--c-sayur'},
 {n:'Bayam',t:'Sayur hijau murah untuk sayur bening atau bubur bayi.',g:['Zat besi','Vitamin A','Serat'],c:'--c-sayur'},
 {n:'Daun singkong',t:'Sayur tradisional yang mengenyangkan dan kaya zat gizi mikro.',g:['Zat besi','Vitamin A','Serat'],c:'--c-sayur'},
 {n:'Ubi jalar oranye',t:'Pengganti nasi yang kaya vitamin A dan serat. Kukus saja.',g:['Vitamin A','Serat'],c:'--c-pokok'},
 {n:'Pepaya',t:'Buah murah sepanjang tahun. Lembut untuk balita dan lansia.',g:['Vitamin A','Serat'],c:'--c-buah'},
 {n:'Kacang hijau',t:'Bubur kacang hijau mengandung protein, zat besi, dan serat.',g:['Protein','Zat besi','Serat'],c:'--c-sayur'}
];
var flt='Semua';
var fb=$('#filters');
fb.innerHTML=['Semua'].concat(NUT).map(function(n){return '<button type="button" aria-pressed="'+(n===flt)+'" data-f="'+n+'">'+n+'</button>'}).join('');
function renderFoods(){
  $('#foods').innerHTML=FD.filter(function(f){return flt==='Semua'||f.g.indexOf(flt)>-1}).map(function(f,i){
    return '<article class="food" style="--sw:var('+f.c+');animation-delay:'+(i*45)+'ms"><h3>'+f.n+'</h3><p>'+f.t+'</p><div class="nut">'+f.g.map(function(x){return '<span'+(x===flt?' class="m"':'')+'>'+x+'</span>'}).join('')+'</div></article>';
  }).join('');
}
fb.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;flt=b.dataset.f;$$('button',fb).forEach(function(x){x.setAttribute('aria-pressed',x===b)});renderFoods()});
renderFoods();

/* ---------- 1000 days ---------- */
var PH=[
 {to:270,col:'--c-sayur',t:'Masa kehamilan',b:['Minum tablet tambah darah, minimal 90 tablet selama kehamilan.','Periksa kehamilan rutin ke Puskesmas atau bidan.','Makan beragam dengan tambahan protein hewani, sayur, dan buah.']},
 {to:450,col:'--c-pokok',t:'ASI eksklusif (0–6 bulan)',b:['Inisiasi menyusu dini, lalu beri ASI saja tanpa tambahan makanan atau minuman.','Timbang dan ukur bayi di Posyandu setiap bulan.','Lengkapi imunisasi dasar sesuai jadwal.']},
 {to:1000,col:'--c-lauk',t:'ASI dan MPASI (6–24 bulan)',b:['Mulai MPASI pada usia 6 bulan dan lanjutkan ASI sampai 2 tahun.','Beri protein hewani setiap hari: telur, ikan, atau hati ayam.','Tambah variasi jenis dan tekstur makanan secara bertahap.']}
];
var dayIn=$('#day'),hc=$('#hpkCard');
function hpk(){
  var d=+dayIn.value,p=PH.filter(function(x){return d<=x.to})[0],age='';
  if(d<=270){age='Usia kehamilan sekitar '+Math.max(1,Math.ceil(d/30.4))+' bulan'}
  else{var a=d-270,m=Math.floor(a/30.4);age=m<1?'Bayi usia '+a+' hari':'Anak usia '+m+' bulan'}
  hc.style.setProperty('--pc','var('+p.col+')');
  hc.innerHTML='<div class="big"><small>Hari ke</small>'+nf.format(d)+'</div><div><h3>'+p.t+'</h3><div class="age">'+age+'</div><ul>'+p.b.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></div>';
}
dayIn.addEventListener('input',hpk);hpk();

/* ---------- actions ---------- */
var AC=[
 ['Tanam tiga jenis sayur','Kangkung, bayam, atau cabai di pot, polybag, atau pekarangan.'],
 ['Sediakan telur atau tempe setiap hari','Protein terjangkau untuk semua anggota keluarga.'],
 ['Pegang batas G4G1L5','Gula 4 sdm, garam 1 sdt, lemak 5 sdm per orang per hari.'],
 ['Simpan cadangan pangan dua minggu','Beras dan bahan kering. Pakai yang paling lama lebih dulu.'],
 ['Timbang anak balita di Posyandu','Setiap bulan, agar gangguan tumbuh terlihat sejak dini.'],
 ['Cuci tangan dan masak air minum','Mencegah diare dan infeksi yang menghambat penyerapan gizi.'],
 ['Rencanakan menu dan daftar belanja','Belanja sesuai daftar supaya hemat dan tidak ada bahan terbuang.'],
 ['Olah sisa makanan jadi menu baru','Nasi sisa jadi nasi goreng, sayur sisa jadi sup. Kurangi makanan terbuang.']
];
var done={};try{done=JSON.parse(store.get('pt-actions')||'{}')||{}}catch(e){done={}}
$('#todo').innerHTML=AC.map(function(a,i){return '<li id="li'+i+'"><label for="ck'+i+'"><input type="checkbox" id="ck'+i+'" data-i="'+i+'"><span class="box"><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span><b>'+a[0]+'</b><small>'+a[1]+'</small></span></label></li>'}).join('');
function paintActions(){
  var n=0;AC.forEach(function(_,i){var c=$('#ck'+i);c.checked=!!done[i];$('#li'+i).classList.toggle('d',c.checked);if(c.checked)n++});
  $('#ringFg').setAttribute('stroke-dasharray',(n/AC.length*100)+' 100');$('#ringNum').textContent=n+'/'+AC.length;
  $('#ringBox').classList.toggle('done',n===AC.length);
  $('#ringTxt').textContent=n===0?'Mulai dari satu langkah.':n<AC.length?'Bagus, lanjutkan. '+(AC.length-n)+' langkah lagi.':'Semua selesai. Rumah Anda makin tangguh.';
}
$('#todo').addEventListener('change',function(e){var c=e.target;if(c.dataset.i===undefined)return;done[c.dataset.i]=c.checked;store.set('pt-actions',JSON.stringify(done));paintActions()});
paintActions();

/* ---------- FAQ ---------- */
var FQ=[
 ['Apakah anak pendek pasti karena keturunan?','Tidak selalu. Stunting terutama berkaitan dengan kekurangan gizi dalam jangka panjang dan infeksi yang berulang, khususnya pada 1.000 hari pertama. Gizi dan lingkungan berperan jauh lebih besar daripada faktor keturunan.'],
 ['Makanan bergizi harus mahal?','Tidak. Telur, tempe, ikan lokal, dan sayur musiman termasuk sumber gizi yang terjangkau. Kuncinya variasi dan perencanaan belanja. Coba kalkulator di atas untuk melihat perkiraan biayanya.'],
 ['Anak kenyang berarti gizinya cukup?','Belum tentu. Nasi yang banyak membuat kenyang, tetapi tanpa lauk dan sayur anak bisa kekurangan protein, zat besi, dan vitamin. Perhatikan isi piringnya, bukan hanya banyaknya.'],
 ['Boleh kental manis sebagai pengganti susu?','Tidak dianjurkan. Kental manis tinggi gula dan bukan pengganti ASI maupun susu untuk balita. Pilih ASI, makanan beragam, dan susu sesuai anjuran tenaga kesehatan.'],
 ['Perlukah suplemen vitamin?','Umumnya kebutuhan terpenuhi dari makanan beragam. Pengecualiannya tablet tambah darah untuk ibu hamil. Balita usia 6 sampai 59 bulan mendapat kapsul vitamin A di Posyandu setiap Februari dan Agustus.']
];
$('#faq').innerHTML=FQ.map(function(f){return '<details><summary>'+f[0]+'</summary><div class="a">'+f[1]+'</div></details>'}).join('');
})();
