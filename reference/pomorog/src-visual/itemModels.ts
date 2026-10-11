import * as THREE from 'three'
import { ITEMS } from '../../engine'

/** Small physical props, photographed by the same ASCII pass as the world. */
export function createItemModel(id: string) {
  const root = new THREE.Group(), item = ITEMS[id]
  const mat = (color: number) => new THREE.MeshStandardMaterial({ color, roughness: .85, metalness: .08, flatShading: true })
  const iron = mat(id.includes('rusty') ? 0xb4aaa0 : 0xb7c2ce), gold = mat(0xe1b965), leather = mat(0x97614b), wood = mat(0xa17c51)
  const dark = mat(0x34323e), bone = mat(0xd8ccae), red = mat(0xb7514e), green = mat(0x83ae73), purple = mat(0xa481d3), blue = mat(0x79b6d9)
  const allMaterials = [iron, gold, leather, wood, dark, bone, red, green, purple, blue]
  function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0, parent: THREE.Object3D = root) {
    const object = new THREE.Mesh(geometry, material); object.position.set(x, y, z); parent.add(object); return object
  }
  const box = (w: number, h: number, d: number, material: THREE.Material, x = 0, y = 0, z = 0) => mesh(new THREE.BoxGeometry(w, h, d), material, x, y, z)
  const ball = (r: number, material: THREE.Material, x = 0, y = 0, z = 0) => mesh(new THREE.IcosahedronGeometry(r, 1), material, x, y, z)
  const cylinder = (r: number, r2: number, h: number, material: THREE.Material, x = 0, y = 0, z = 0) => mesh(new THREE.CylinderGeometry(r, r2, h, 8), material, x, y, z)
  const torus = (r: number, tube: number, material: THREE.Material, x = 0, y = 0, z = 0) => mesh(new THREE.TorusGeometry(r, tube, 6, 16), material, x, y, z)
  function strand(points: number[][], radius: number, material: THREE.Material) {
    return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p as [number,number,number]))), 16, radius, 5, false), material)
  }
  function plate(points: number[][], depth: number, material: THREE.Material) {
    const shape = new THREE.Shape(); points.forEach(([x,y], i) => i ? shape.lineTo(x,y) : shape.moveTo(x,y)); shape.closePath()
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: .025, bevelSize: .02, bevelSegments: 1, steps: 1 })
    return mesh(g, material)
  }
  if (item.slot === 'weapon') {
    if (id.includes('bow')) {
      const ornate = id === 'hunting_bow'
      strand([[.1,-1.05,0],[-.35,-.65,0],[-.58,0,0],[-.35,.65,0],[.1,1.05,0]], ornate ? .09 : .07, wood)
      strand([[.1,-1.05,0],[.1,1.05,0]], .013, bone)
      box(.18,.42,.19, leather,-.57,0,0)
      if (ornate) for (const y of [-.7,.7]) torus(.1,.04,gold,-.33,y).rotation.y=Math.PI/2
      strand([[-.28,-.8,.17],[-.28,1.1,.17]],.025,wood)
      mesh(new THREE.ConeGeometry(.09,.27,4),iron,-.28,1.2,.17)
    } else if (id.includes('staff')) {
      const runed = id === 'runed_staff'; cylinder(.055,.09,1.9,wood,0,-.08)
      torus(.2,.065,runed ? gold : wood,0,.95)
      if (runed) { mesh(new THREE.OctahedronGeometry(.2),blue,0,.97); for (const y of [-.7,0,.58]) cylinder(.1,.1,.08,gold,0,y) }
      else { const branch = cylinder(.03,.055,.48,wood,.15,.72); branch.rotation.z=-.45 }
    } else {
      const rare = id === 'moonfang', hunter = id === 'hunters_blade'
      box(.13,.48,.14,leather,0,-.79)
      box(hunter ? .62 : .5,.1,.2,rare ? gold : iron,0,-.49)
      ball(.12,rare ? blue : gold,0,-1.08)
      const points = rare ? [[-.13,-.42],[.1,-.42],[.28,.67],[.15,1.24],[-.13,.8]] : hunter ? [[-.13,-.42],[.16,-.42],[.32,.66],[.15,1.12],[-.12,.87]] : [[-.12,-.42],[.12,-.42],[.12,.82],[0,1.12],[-.12,.82]]
      plate(points,.07,rare ? blue : iron)
      box(.028,1.12,.015,rare ? bone : dark,.015,.17,.098)
      if (id === 'rusty_sword') for (let i=0;i<4;i++) box(.08,.045,.01,leather,(i%2 ? 1 : -1)*.055,i*.2-.2,.101)
    }
    root.rotation.z = -.6
    if (!id.includes('staff') && !id.includes('bow')) root.scale.x = 1.4
  } else if (item.slot === 'armor') {
    const robe = id === 'mage_robe', steel = id !== 'leather_armor' && !robe, fabric = robe ? purple : steel ? iron : leather
    cylinder(.38,.34,.92,fabric,0,.15); cylinder(.29,.51,robe ? 1 : .4,fabric,0,robe ? -.73 : -.5)
    for (const side of [-1,1]) { const shoulder=ball(.28, fabric, side*.5,.45); shoulder.scale.set(1.05,.65,1); const sleeve=cylinder(.18,.13,robe ? .68 : .36,fabric,side*.57,.17); sleeve.rotation.z=side*.18 }
    torus(.24,.045,steel ? gold : bone,0,.64).rotation.x=Math.PI/2
    box(.13,.8,.05,steel ? gold : dark,0,.12,.37); box(.78,.1,.67,dark,0,-.25);box(.16,.14,.055,gold,0,-.25,.38)
    if (id === 'warden_plate') { ball(.14,blue,0,.37,.41); for(const side of [-1,1])mesh(new THREE.ConeGeometry(.1,.25,4),gold,side*.5,.67) }
    if (robe) for(const x of [-.28,0,.28]) box(.03,.55,.03,gold,x,-.85,.35)
  } else if (item.slot === 'helmet') {
    mesh(new THREE.SphereGeometry(.57,10,7,0,Math.PI*2,0,Math.PI*.64),id === 'grim_helm' ? dark : iron,0,.1)
    box(.85,.11,.13,dark,0,.14,.49);box(.08,.58,.14,gold,0,.04,.53)
    for(const side of [-1,1]) box(.18,.53,.34,iron,side*.39,-.13,.3)
    if(id === 'grim_helm') for(const side of [-1,1]) { const horn=mesh(new THREE.ConeGeometry(.16,.8,5),bone,side*.56,.43);horn.rotation.z=-side*.65 }
    else box(.07,.24,.69,gold,0,.57)
  } else if (item.slot === 'boots') {
    for(const x of [-.32,.32]) { cylinder(.19,.22,.8,id==='iron_boots'?iron:leather,x,.15);box(.42,.25,.75,dark,x,-.31,.17);box(.4,.22,.48,id==='iron_boots'?iron:leather,x,-.23,.32);for(const y of [.01,.27])box(.42,.07,.39,wood,x,y);box(.1,.14,.04,gold,x,.26,.22) }
  } else if (item.slot === 'ring') {
    torus(.48,.1,id==='old_ring'?iron:gold)
    if (id==='ring_of_hunt') { box(.34,.23,.16,gold,0,.46);mesh(new THREE.OctahedronGeometry(.18),green,0,.5,.16) }
    else for(const x of [-.15,.15])box(.04,.1,.04,dark,x,.48,.085)
  } else if (item.slot === 'amulet') {
    strand([[-.34,.75,0],[-.43,.26,0],[-.14,-.12,.06],[0,-.24,.07],[.14,-.12,.06],[.43,.26,0],[.34,.75,0]],.025,leather)
    for(const x of [-.18,.02,.2]) { const fang=mesh(new THREE.ConeGeometry(.11,.52,6),bone,x,-.4);fang.rotation.z=Math.PI+x }
    torus(.1,.035,gold,0,-.17)
  } else if (item.slot === 'shield') {
    const steel=id==='iron_shield'
    plate([[-.55,.6],[0,.78],[.55,.6],[.49,-.2],[0,-.76],[-.49,-.2]],.13,steel?iron:wood)
    box(.09,1.2,.06,steel?gold:iron,0,.02,.18);box(.9,.09,.06,steel?gold:iron,0,.2,.18);ball(.15,steel?gold:iron,0,.18,.19)
    for(const side of [-1,1])for(const y of [-.15,.4])ball(.055,iron,side*.35,y,.2)
  } else if (item.slot === 'cape' || id==='war_banner') {
    plate([[-.22,.75],[.22,.75],[.64,-.68],[.2,-.6],[0,-.82],[-.22,-.6],[-.64,-.68]],.035,red)
    for(const x of [-.22,0,.22]) box(.018,.9,.02,leather,x,-.1,.07)
    if(id==='war_banner'){cylinder(.04,.04,2.2,wood,-.68);box(1.4,.06,.08,gold,0,.78);box(.17,.48,.04,gold,0,0,.07)}else torus(.2,.055,gold,0,.68)
  } else if (id==='oak_log') {
    for(const [x,y] of [[-.28,-.13],[.28,-.13],[0,.28]]) {const log=cylinder(.24,.27,1.35,wood,x,y);log.rotation.x=Math.PI/2; const cut=cylinder(.23,.23,.015,bone,x,y,.68);cut.rotation.x=Math.PI/2;for(const r of [.09,.17])torus(r,.013,leather,x,y,.7)}
  } else if (id==='forest_herb') {
    for(let i=0;i<5;i++){const x=(i-2)*.18;strand([[0,-.7,0],[x,.1,0],[x*1.5,.7-Math.abs(x),0]],.025,wood);for(const side of [-1,1]){const leaf=ball(.23,green,x+side*.15,.2+side*.16,.04);leaf.scale.set(1,.4,.23);leaf.rotation.z=side*.5}}
    torus(.1,.03,leather,0,-.35).rotation.x=Math.PI/2
  } else if(id==='cave_mushroom'){
    for(const [x,y,r] of [[-.25,-.1,.38],[.27,.13,.5]]){cylinder(.08,.15,.6,bone,x,y-.25);mesh(new THREE.SphereGeometry(r,9,5,0,Math.PI*2,0,Math.PI/2),purple,x,y+.08);for(let i=0;i<3;i++)ball(.055,bone,x+(i-1)*.17,y+.3,.15)}
  } else if(/ore|core|moon_shard|dark_essence/.test(id)) {
    const tone=id==='ember_core'?red:id==='frost_core'?blue:id==='storm_core'?gold:id==='dark_essence'?purple:id==='moon_shard'?blue:iron
    if(id==='iron_ore'){ball(.55,dark);for(const [x,y,z] of [[-.3,.3,.2],[.3,.1,.3],[0,.4,-.2]])mesh(new THREE.OctahedronGeometry(.29),iron,x,y,z)}
    else {for(const [x,y,r] of [[0,.1,.58],[-.36,-.15,.28],[.34,-.28,.3]]){const crystal=mesh(new THREE.OctahedronGeometry(r),tone,x,y);crystal.scale.y=1.45;crystal.rotation.z=x*.7}if(id.includes('core'))torus(.6,.035,gold).rotation.x=.8}
  } else if(/fang|claw|stinger|bone_shard|blade_shard/.test(id)) {
    if(id==='blade_shard')plate([[-.32,-.5],[.27,-.39],[.17,.37],[.04,.26],[-.15,.65],[-.29,.27]],.1,iron)
    else {const count=id==='beast_claw'?3:1;for(let i=0;i<count;i++){const x=(i-(count-1)/2)*.28;const tooth=mesh(new THREE.ConeGeometry(id==='bone_shard'?.22:.18,1.25,6),id==='wasp_stinger'?gold:bone,x,0);tooth.rotation.z=.4+i*.13;ball(.21,id==='wasp_stinger'?dark:leather,x+.23,-.5)}}
  } else if(/pelt|hide|chitin/.test(id)) {
    if(id==='chitin_plate'){const shell=mesh(new THREE.SphereGeometry(.65,8,6,0,Math.PI*2,0,Math.PI*.6),gold);shell.scale.set(.75,.35,1);for(const x of [-.3,0,.3])box(.025,.13,.7,dark,x,.15,.15)}
    else {plate([[-.42,.52],[-.14,.43],[.04,.76],[.25,.42],[.61,.5],[.4,.03],[.65,-.56],[.2,-.43],[0,-.73],[-.27,-.48],[-.62,-.6],[-.45,-.05]],.05,id==='wolf_pelt'?bone:leather);for(const x of [-.24,0,.24])box(.06,.6,.02,dark,x,-.05,.075)}
  } else if(id==='cracked_skull') {
    const skull=ball(.55,bone,0,.18);skull.scale.set(1,.9,.75);box(.66,.23,.54,bone,0,-.32,.1)
    for(const side of [-1,1]){ball(.16,dark,side*.23,.18,.38);box(.15,.05,.03,dark,side*.17,-.33,.39)}mesh(new THREE.ConeGeometry(.1,.18,3),dark,0,-.09,.46);strand([[.16,.64,.22],[.03,.5,.35],[.1,.4,.42]],.019,dark)
  } else if(id==='gazing_eye') {
    ball(.57,bone);const iris=ball(.33,purple,0,.04,.45);iris.scale.z=.3;const pupil=ball(.17,dark,0,.04,.54);pupil.scale.z=.25;ball(.055,bone,-.1,.15,.58)
  } else if(id==='writhing_tendril') {
    strand([[-.4,-.6,0],[.3,-.45,.12],[.38,.2,0],[-.1,.55,0],[-.25,.24,.16],[.1,.06,.2]],.13,purple)
    for(const [x,y]of [[.3,-.3],[.37,-.1],[.25,.2]])ball(.07,red,x,y,.15)
  } else if(id==='goblin_hand') {
    box(.53,.5,.21,green,0,-.15);for(let i=0;i<4;i++){const x=(i-1.5)*.16;cylinder(.068,.085,.48,green,x,.33);mesh(new THREE.ConeGeometry(.07,.15,5),bone,x,.64)}const thumb=cylinder(.08,.1,.38,green,-.4,0);thumb.rotation.z=.8;box(.33,.16,.23,leather,0,-.48)
  } else if(id==='predator_heart') {ball(.35,red,-.2,.2);ball(.36,red,.21,.18);mesh(new THREE.ConeGeometry(.41,.72,7),red,0,-.28).rotation.z=Math.PI;for(const x of [-.16,.15])cylinder(.09,.12,.33,leather,x,.57)}
  else if(id==='cursed_sigil'){torus(.53,.07,purple);for(let i=0;i<3;i++){const bar=box(.9,.045,.055,gold,0,0,.12);bar.rotation.z=i*Math.PI/3}mesh(new THREE.OctahedronGeometry(.21),red,0,0,.15)}
  else if(id==='void_pearl'){ball(.47,purple);torus(.55,.04,gold).rotation.x=.9;ball(.07,blue,-.17,.2,.42)}
  else if(id==='spider_silk'){for(let i=0;i<7;i++){const ring=torus(.32+(i%3)*.04,.035,bone,0,(i-3)*.09);ring.rotation.x=Math.PI/2}strand([[.3,.05,0],[.55,-.2,.1],[.45,-.45,.2],[.1,-.52,.3]],.025,bone)}
  else if(id==='venom_sac'||id==='black_ichor'){const sack=ball(.5,id==='venom_sac'?green:purple);sack.scale.set(.85,1.15,.85);cylinder(.14,.2,.23,dark,0,.51);torus(.17,.035,bone,0,.51).rotation.x=Math.PI/2;for(const y of [-.2,.1])ball(.08,id==='venom_sac'?gold:blue,.2,y,.38)}
  else {const sack=ball(.5,id==='grave_dust'?bone:leather);sack.scale.set(1,.95,.75);cylinder(.16,.22,.3,leather,0,.44);torus(.19,.035,gold,0,.42).rotation.x=Math.PI/2;if(id==='worn_coin_pouch')for(const x of [-.28,.1,.35])cylinder(.14,.14,.045,gold,x,-.48,.35)}
  root.rotation.y = -.18
  // Dispose unused palette materials too; generated assets leave no GPU resources behind.
  root.userData.materials = allMaterials
  return root
}
