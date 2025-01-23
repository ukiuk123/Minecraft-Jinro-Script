import { world, system, ItemStack } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

/*
- tag
  - roles
      simin
      zinrou
      kyozin
      uranai
      reibai
      kariudo
      youko
      kyosin
      tairou
      kogitune
      hutago
      korou
      honrou
      kaitou
      ookamituki
      zombie
      tenseisha
      police
      shokyaku
  - uranai
      siro
      kuro
  - reibai
      r_siro
      r_kuro
      r_tairou
  - team
      zinrou_team
      simin_team
      youko_team
      zombie_team
      kyozin_team
  - kaitou
      stole_kaitou
      stolen_$[roles]
  - tensei
      re_$[roles]
  - game
      op
      spectator

- scoreboard
  - count
      sigai
      randomitems *
      role
  - timer
      timeset *
      time
      min
      sec
      nazo *
  - info
      §e"MAPNAME" * 7
      ${roles.prop}
  - roles *
      zinrou 
      kyozin
      uranai
      reibai
      kariudo
      youko
      kyosin
      tairou
      kogitune
      hutago
      korou
      honrou
      kaitou
      ookamituki
      zombie
      tenseisha
      police
      shokyaku
*/

// Games Info
const sys = world.getDimension("overworld");

const info_roles = [
  { id: "simin", prop: "§r§l市民", uranai: "siro", reibai: "r_siro", team: "simin_team" },
  { id: "zinrou", prop: "§c§l人狼", uranai: "kuro", reibai: "r_kuro", team: "zinrou_team" },
  { id: "kyozin", prop: "§e§l狂人", uranai: "siro", reibai: "r_siro", team: "kyozin_team" },
  { id: "uranai", prop: "§d§l占い師", uranai: "siro", reibai: "r_siro", team: "simin_team" },
  { id: "reibai", prop: "§b§l霊媒師", uranai: "siro", reibai: "r_siro", team: "simin_team" },
  { id: "kariudo", prop: "§a§l狩人", uranai: "siro", reibai: "r_siro", team: "simin_team" },
  { id: "youko", prop: "§5§l妖狐", uranai: "siro", reibai: "r_siro", team: "youko_team" },
  { id: "kyosin", prop: "§6§l狂信者", uranai: "siro", reibai: "r_siro", team: "kyozin_team" },
  { id: "tairou", prop: "§8§l大狼", uranai: "siro", reibai: "r_tairou", team: "zinrou_team" },
  { id: "kogitune", prop: "§d§l子狐", uranai: "siro", reibai: "r_siro", team: "youko_team" },
  { id: "hutago", prop: "§r§l双子", uranai: "siro", reibai: "r_siro", team: "simin_team" },
  { id: "korou", prop: "§7§l子狼", uranai: "kuro", reibai: "r_kuro", team: "zinrou_team" },
  { id: "honrou", prop: "§7§l翻狼", uranai: "kuro", reibai: "r_kuro", team: "zinrou_team" },
  { id: "kaitou", prop: "§a§l怪盗", uranai: "siro", reibai: "r_siro", team: "simin_team" },
  { id: "ookamituki", prop: "§0§l狼憑き", uranai: "kuro", reibai: "r_siro", team: "simin_team" },
  { id: "zombie", prop: "§2§lゾンビ", uranai: "siro", reibai: "r_siro", team: "zombie_team" },
  { id: "police", prop: "§3§l警察官", uranai: "siro", reibai: "r_siro", team: "simin_team" },
  { id: "shokyaku", prop: "§c§l焼却者", uranai: "kuro", reibai: "r_kuro", team: "zinrou_team" }
];

const items = [
  { id: "wj:touketu", prop: "touketu", name: "凍結" },
  { id: "wj:shinryu_ken", prop: "shinryu_ken", name: "神龍剣" },
  { id: "wj:gisou", prop: "gisou", name: "鐘の矢" },
  { id: "wj:tubasa", prop: "tubasa", name: "剛翼な翼" },
  { id: "wj:migawari", prop: "migawari", name: "身代わり人形" },
  { id: "wj:kusuri", prop: "kusuri", name: "魔法の薬" },
  { id: "wj:uranai_me", prop: "uranai_me", name: "占いの目" },
  { id: "wj:sensor", prop: "sensor", name: "人感知センサー" },
  { id: "wj:bouenkyo", prop: "bouenkyo", name: "望遠鏡" },
  { id: "wj:sinzitu", prop: "sinzitu", name: "真実の目" },
  { id: "wj:ankoku", prop: "ankoku", name: "暗黒のかけら" },
  { id: "wj:shield", prop: "shield", name: "シールド" },
  { id: "wj:kago", prop: "kago", name: "ドラゴンの加護" },
  { id: "wj:kinomi", prop: "kinomi", name: "スケスケの実" },
  { id: "wj:usagi", prop: "usagi", name: "うさぎの靴" },
  { id: "wj:hayabusa", prop: "hayabusa", name: "ハヤブサの羽根" },
  { id: "wj:himo", prop: "himo", name: "運命のひも" }
];
// Game Systems

if (world.getDynamicProperty("map") === undefined) {
  world.setDynamicProperty("map", 0);
}
for (let i = 0; i < items.length; i++) {
  const item = items[i];
  if (world.getDynamicProperty(`${item.prop}`) === undefined) {
    world.setDynamicProperty(`${item.prop}`, true);
  }
}
if (world.getDynamicProperty("playing_game") === undefined) {
  world.setDynamicProperty("playing_game", false);
}
if (world.getDynamicProperty("bgm") === undefined) {
  world.setDynamicProperty("bgm", true);
}

function view_role() {
  const roleCount = info_roles.length;
  for (let i = 0; i < roleCount; i++) {
    let role = info_roles[i];
    sys.runCommand(`execute if entity @a[tag=${role.id}] run tellraw @a {"rawtext":[{"text":"${role.prop} §r: "},{"selector":"@a[tag=${role.id}]"}]}`);
  }
  sys.runCommand(`execute if entity @a[tag=stole_kaitou] run tellraw @a {"rawtext":[{"text":"§a§l怪盗§r: "},{"selector":"@a[tag=stole_kaitou]"}]}`);
  sys.runCommand(`execute if entity @a[tag=tenseisha] run tellraw @a {"rawtext":[{"text":"§2§l転生者§r§7(死んでいない) §r: "},{"selector":"@a[tag=tenseisha]"}]}`);
  for (let i = 0; i < roleCount; i++) {
    let role = info_roles[i];
    sys.runCommand(`execute if entity @a[tag=re_${role.id}] run tellraw @a {"rawtext":[{"text":"${role.prop} §r§7(転生者の前世) §r: "},{"selector":"@a[tag=re_${role.id}]"}]}`);
  }
  for (let i = 0; i < roleCount; i++) {
    let role = info_roles[i];
    sys.runCommand(`execute if entity @a[tag=stolen_${role.id}] run tellraw @a {"rawtext":[{"text":"${role.prop} §r§7(怪盗に盗まれた) §r: "},{"selector":"@a[tag=stolen_${role.id}]"}]}`);
  }
  sys.runCommand(`tellraw @a {"rawtext":[{"text":"§7ーーーーーーーーーーーーーーーーーーーー"}]}`);
}

function clear_role() {
  for (const player of world.getPlayers()) {
    const roleCount = info_roles.length;
    for (let i = 0; i < roleCount; i++) {
      let role = info_roles[i];
      player.runCommand(`tag @s remove ${role.id}`);
      player.runCommand(`tag @s remove stolen_${role.id}`);
      player.runCommand(`tag @s remove re_${role.id}`);
    }
    player.runCommand(`tag @s remove stole_kaitou`);
    player.runCommand(`tag @s remove tenseisha`);

    player.runCommand(`tag @s remove siro`);
    player.runCommand(`tag @s remove r_siro`);
    player.runCommand(`tag @s remove kuro`);
    player.runCommand(`tag @s remove r_kuro`);
    player.runCommand(`tag @s remove r_tairou`);
    player.runCommand(`tag @s remove simin_team`);
    player.runCommand(`tag @s remove kyozin_team`);
    player.runCommand(`tag @s remove zinrou_team`);
    player.runCommand(`tag @s remove youko_team`);
    player.runCommand(`tag @s remove zombie_team`);

    player.runCommand(`tag @s remove death`);
    player.runCommand(`tag @s remove infection`);
    player.runCommand(`tag @s remove yakumoti`);

  }
}

function clear_mapinfo() {
  let objective = world.scoreboard.getObjective("info");
  objective.removeParticipant("§7Map: §eCastleOFARURU");
  objective.removeParticipant("§7Map: §e屋敷");
  objective.removeParticipant("§7Map: §eソーラーアレイ");
  objective.removeParticipant("§7Map: §eDistorted");
  objective.removeParticipant("§7Map: §eKingdom");
  objective.removeParticipant("§7Map: §eParis");
  objective.removeParticipant("§7Map: §eNewCastle");
}

function set_map(message, sourceEntity) {
  let objective = world.scoreboard.getObjective("info");
  if (message <= 6 && message >= 0) {
    world.setDynamicProperty("map", Number(message));
    sourceEntity.runCommand("playsound random.orb @a");

    switch (world.getDynamicProperty("map")) {
      case (0): // Castle OF ARURU
        sourceEntity.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §7MAPを §e§lCastle OF ARURU §r§7にしました"}]}');
        clear_mapinfo();
        objective.setScore("§7Map: §eCastleOFARURU", 99);
        break;
      case (1): // 屋敷
        sourceEntity.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §7MAPを §e§l屋敷 §r§7にしました"}]}');
        clear_mapinfo();
        objective.setScore("§7Map: §e屋敷", 99);
        break;
      case (2): // ソーラーアレイ
        sourceEntity.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §7MAPを §e§lソーラーアレイ §r§7にしました"}]}');
        clear_mapinfo();
        objective.setScore("§7Map: §eソーラーアレイ", 99);
        break;
      case (3): // Distorted
        sourceEntity.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §7MAPを §e§lDistorted §r§7にしました"}]}');
        clear_mapinfo();
        objective.setScore("§7Map: §eDistorted", 99);
        break;
      case (4): // Kingdom
        sourceEntity.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §7MAPを §e§lKingdom §r§7にしました"}]}');
        clear_mapinfo();
        objective.setScore("§7Map: §eKingdom", 99);
        break;
      case (5): // Paris
        sourceEntity.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §7MAPを §e§lParis §r§7にしました"}]}');
        clear_mapinfo();
        objective.setScore("§7Map: §eParis", 99);
        break;
      case (6): // New Castle
        sourceEntity.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §7MAPを §e§lNew Castle §r§7にしました"}]}');
        clear_mapinfo();
        objective.setScore("§7Map: §eNewCastle", 99);
        break;
    }
  } else {
    sourceEntity.sendMessage("Error : Message's Range is 0 ~ 6");
  }
}

system.runInterval(() => {
  let objective = world.scoreboard.getObjective("roles");
  const roleCount = info_roles.length;
  for (let i = 0; i < roleCount; i++) {
    const role = info_roles[i];
    try {
      if (objective.getScore(role.id) === null || objective.getScore(role.id) === undefined) {
        objective.setScore(role.id, 0);
      }
    } catch {
      objective.setScore(role.id, 0);
    }
  }
});

async function uranai(sender) {
  const form = new ActionFormData();
  form.title("§8占うことができる人");
  let number = 0;
  const Playerlist = new Map();
  for (const player of world.getPlayers()) {
    if (player.hasTag("sanka")) {
      form.button(player.nameTag);
      Playerlist.set(number, player);
    }
    number += 1;
  }

  form.show(sender).then(response => {
    if (!response.canceled) {
      const selectedPlayer = Playerlist.get(response.selection);
      const tags = selectedPlayer.getTags();
      const playerName = selectedPlayer.nameTag;
      const inventory = sender.getComponent("inventory");
      const slot = inventory.container.getSlot(sender.selectedSlotIndex);

      if (slot.typeId == "wj:uranai") {
        if (sender.getTags().includes("uranai") || sender.getTags().includes("kogitune")) {

          if (tags.includes("kuro")) {
            sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§d 占い §7] §e${playerName} §7は §8§l黒 §7です。"}]}`);

          } else if (tags.includes("siro")) {
            sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§d 占い §7] §e${playerName} §7は §r§l白 §r§7です。"}]}`);
          }

          if (tags.includes("youko")) {
            sender.runCommandAsync(`kill ${playerName}`);
          }

          sender.runCommandAsync(`playsound respawn_anchor.deplete`);
          sender.runCommandAsync(`clear @s wj:uranai 0 1`);

        } else if (sender.getTags().includes("stolen_uranai")) {
          sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§d 占い §7] §e${playerName} §7は §r§l白 §r§7です。"}]}`);
          sender.runCommandAsync(`playsound respawn_anchor.set_spawn`);
          sender.runCommandAsync(`clear @s wj:uranai 0 1`);

        } else {
          sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§d 占い §7] §7あなたは占いか子狐ではありません。"}]}`);
          sender.runCommandAsync(`playsound respawn_anchor.charge`);
        }

      } else {
        sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§d 占い §7] §7手に §d占いの棒 §7を持ってください。"}]}`);
        sender.runCommandAsync(`playsound respawn_anchor.charge`);
      }
    }
  })
}

async function reibai(sender) {
  const form = new ActionFormData();
  form.title("§8霊媒することができる人");
  let number = 0;
  const Playerlist = new Map();
  for (const player of world.getPlayers()) {
    if (player.hasTag("sanka")) {
      form.button(player.nameTag);
      Playerlist.set(number, player);
    }
    number += 1;
  }

  form.show(sender).then(response => {
    if (!response.canceled) {
      const selectedPlayer = Playerlist.get(response.selection);
      const tags = selectedPlayer.getTags();
      const playerName = selectedPlayer.nameTag;
      const inventory = sender.getComponent("inventory");
      const slot = inventory.container.getSlot(sender.selectedSlotIndex);

      if (slot.typeId == "wj:reibai") {

        if (sender.getTags().includes("reibai")) {

          if (tags.includes("r_kuro") && tags.includes("death")) {
            sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §e${playerName} §7は §8§l黒 §7です。"}]}`);
          } else if (tags.includes("r_siro") && tags.includes("death")) {
            sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §e${playerName} §7は §r§l白 §r§7です。"}]}`);
          } else if (tags.includes("r_tairou") && tags.includes("death")) {
            sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §e${playerName} §7は §8§l大狼 §r§7です。"}]}`);
          } else {
            sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §e${playerName} §7は 霊媒できませんでした"}]}`);
          }

          sender.runCommandAsync(`playsound conduit.attack`);
          sender.runCommandAsync(`clear @s wj:reibai 0 1`);

        } else if (sender.getTags().includes("stolen_reibai")) {
          sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §e${playerName} §7は §r§l白 §r§7です。"}]}`);
          sender.runCommandAsync(`playsound conduit.attack`);
          sender.runCommandAsync(`clear @s wj:reibai 0 1`);

        } else {
          sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §7あなたは霊媒ではありません。"}]}`);
          sender.runCommandAsync(`playsound conduit.short`);
        }

      } else {
        sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §7手に §b霊媒の目 §7を持ってください。"}]}`);
        sender.runCommandAsync(`playsound conduit.short`);
      }
    }
  })
}

async function kariudo(sender) {
  const form = new ActionFormData();
  form.title("§8護衛することができる人");
  let number = 0;
  const Playerlist = new Map();
  for (const player of world.getPlayers()) {
    if (player.hasTag("sanka")) {
      form.button(player.nameTag);
      Playerlist.set(number, player);
    }
    number += 1;
  }

  form.show(sender).then(response => {
    if (!response.canceled) {
      const selectedPlayer = Playerlist.get(response.selection);
      const playerName = selectedPlayer.nameTag;
      const inventory = sender.getComponent("inventory");
      const slot = inventory.container.getSlot(sender.selectedSlotIndex);

      if (slot.typeId == "wj:kariudo") {
        if (sender.getTags().includes("kariudo")) {

          sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 狩人 §7] §e${playerName} §7にトーテムを渡しました。"}]}`);
          selectedPlayer.runCommandAsync(`scriptevent wj:migawari`);
          sender.runCommandAsync(`playsound vault.open_shutter`);
          sender.runCommandAsync(`clear @s wj:kariudo 0 1`);

        } else if (sender.getTags().includes("stolen_kariudo")) {
          sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 狩人 §7] §e${playerName} §7にトーテムを渡しました。"}]}`);
          sender.runCommandAsync(`playsound vault.open_shutter`);
          sender.runCommandAsync(`clear @s wj:kariudo 0 1`);
        } else {
          sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 狩人 §7] §7あなたは狩人ではありません。"}]}`);
          sender.runCommandAsync(`playsound vault.deactivate`);
        }
      } else {
        sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 狩人 §7] §7手に §6狩人の瓶 §7を持ってください。"}]}`);
        sender.runCommandAsync(`playsound vault.deactivate`);
      }
    }
  })
}

async function kaitou(sender) {
  const form = new ActionFormData();
  form.title("§8盗むことができる人");
  let number = 0;
  const Playerlist = new Map();
  for (const player of world.getPlayers()) {
    if (player.hasTag("sanka")) {
      form.button(player.nameTag);
      Playerlist.set(number, player);
    }
    number += 1;
  }

  form.show(sender).then(response => {
    if (!response.canceled) {
      const selectedPlayer = Playerlist.get(response.selection);
      const playerName = selectedPlayer.nameTag;
      const inventory = sender.getComponent("inventory");
      const slot = inventory.container.getSlot(sender.selectedSlotIndex);
      const roleCount = info_roles.length;

      if (slot.typeId == "wj:kaitou") {
        if (sender.getTags().includes("kaitou")) {
          let roleFound = false;
          for (let i = 0; i < roleCount; i++) {
            const role = info_roles[i];

            if (selectedPlayer.getTags().includes(role.id)) {
              if (selectedPlayer === sender) {
                roleFound = true;
                sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 怪盗 §7] §e${playerName} §7の役職を盗み、 §r§l市民 §r§7になりました。"}]}`);
                sender.runCommandAsync(`tag @s remove kaitou`);
                sender.runCommandAsync(`tag @s add stole_kaitou`);
                sender.runCommandAsync(`tag @s add simin`);
                sender.runCommandAsync(`playsound trial_spawner.charge_activate`);
                break;
              } else {
                roleFound = true;
                sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 怪盗 §7] §e${playerName} §7の役職を盗み、 ${role.prop} §r§7になりました。"}]}`);
                sender.runCommandAsync(`tag @s remove kaitou`);
                sender.runCommandAsync(`tag @s add stole_kaitou`);
                sender.runCommandAsync(`tag @s remove siro`);
                sender.runCommandAsync(`tag @s remove r_siro`);
                sender.runCommandAsync(`tag @s remove simin_team`);
                sender.runCommandAsync(`tag @s add ${role.id}`);

                selectedPlayer.runCommandAsync(`tag @s remove ${role.id}`)
                selectedPlayer.runCommandAsync(`tag @s add stolen_${role.id}`);
                selectedPlayer.runCommandAsync(`tag @s remove siro`);
                selectedPlayer.runCommandAsync(`tag @s remove kuro`);
                selectedPlayer.runCommandAsync(`tag @s remove r_siro`);
                selectedPlayer.runCommandAsync(`tag @s remove r_kuro`);
                selectedPlayer.runCommandAsync(`tag @s remove simin_team`);
                selectedPlayer.runCommandAsync(`tag @s remove kyozin_team`);
                selectedPlayer.runCommandAsync(`tag @s remove zinrou_team`);
                selectedPlayer.runCommandAsync(`tag @s remove youko_team`);
                selectedPlayer.runCommandAsync(`tag @s remove zombie_team`);
                selectedPlayer.runCommandAsync(`tag @s add simin`);

                sender.runCommandAsync(`playsound trial_spawner.charge_activate`);
                break;
              }
            }
          }
          if (!roleFound) {
            sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 怪盗 §7] §e${playerName} §7の役職が見つかりませんでした。"}]}`);
            sender.runCommandAsync(`playsound trial_spawner.ambient_ominous`);
          } else {
            sender.runCommandAsync(`clear @s wj:kaitou 0 1`);
          }
        } else if (sender.getTags().includes("stolen_kaitou")) {
          if (slot.typeId == "wj:kaitou") {
            sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 怪盗 §7] §e${playerName} §7の役職を盗み、 §r§l市民 §r§7になりました。"}]}`);
            sender.runCommandAsync(`playsound trial_spawner.charge_activate`);
            sender.runCommandAsync(`clear @s wj:kaitou 0 1`);
          }
        } else {
          sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 怪盗 §7] §7あなたは怪盗ではありません。"}]}`);
          sender.runCommandAsync(`playsound trial_spawner.ambient_ominous`);
        }
      }
    }
  })
}

function player_roles() {
  let roleCounts = {
    zinrou: 0,
    kyozin: 0,
    uranai: 0,
    reibai: 0,
    kariudo: 0,
    youko: 0,
    kyosin: 0,
    tairou: 0,
    kogitune: 0,
    hutago: 0,
    korou: 0,
    honrou: 0,
    kaitou: 0,
    ookamituki: 0,
    zombie: 0,
    police: 0,
    shokyaku: 0
  };

  let objective = world.scoreboard.getObjective("roles");

  const allPlayers = Array.from(world.getPlayers());
  const sankaPlayers = allPlayers.filter(player => player.getTags().includes("sanka"));

  for (let i = sankaPlayers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sankaPlayers[i], sankaPlayers[j]] = [sankaPlayers[j], sankaPlayers[i]];
  }

  sankaPlayers.forEach(player => {
    if (!player.getTags().includes("yakumoti")) {
      let get_role = false;

      for (const role of Object.keys(roleCounts)) {
        if (roleCounts[role] < objective.getScore(role)) {

          player.runCommand(`tag @s add ${role}`);
          player.runCommand("tag @s add yakumoti");

          let roleMessage;

          switch (role) {
            case 'zinrou':
              roleMessage = "§7あなたの役職は §c§l人狼 §r§7です。";
              break;
            case 'kyozin':
              roleMessage = "§7あなたの役職は §e§l狂人 §r§7です。";
              break;
            case 'uranai':
              roleMessage = "§7あなたの役職は §d§l占い師 §r§7です。";
              break;
            case 'reibai':
              roleMessage = "§7あなたの役職は §b§l霊媒師 §r§7です。";
              break;
            case 'kariudo':
              roleMessage = "§7あなたの役職は §a§l狩人 §r§7です。";
              break;
            case 'youko':
              roleMessage = "§7あなたの役職は §5§l妖狐 §r§7です。";
              break;
            case 'kyosin':
              roleMessage = "§7あなたの役職は §6§l狂信者 §r§7です。";
              break;
            case 'tairou':
              roleMessage = "§7あなたの役職は §8§l大狼 §r§7です。";
              break;
            case 'kogitune':
              roleMessage = "§7あなたの役職は §d§l子狐 §r§7です。";
              break;
            case 'hutago':
              roleMessage = "§7あなたの役職は §r§l双子 §r§7です。";
              break;
            case 'korou':
              roleMessage = "§7あなたの役職は §7§l子狼 §r§7です。";
              break;
            case 'honrou':
              roleMessage = "§7あなたの役職は §7§l翻狼 §r§7です。";
              break;
            case 'kaitou':
              roleMessage = "§7あなたの役職は §a§l怪盗 §r§7です。";
              break;
            case 'ookamituki':
              roleMessage = "§7あなたの役職は §0§l狼憑き §r§7です。";
              break;
            case 'zombie':
              roleMessage = "§7あなたの役職は §2§lゾンビ §r§7です。";
              break;
            case 'police':
              roleMessage = "§7あなたの役職は §3§l警察官 §r§7です。";
              break;
            case 'shokyaku':
              roleMessage = "§7あなたの役職は §c§l焼却者 §r§7です。";
              break;
          }

          player.sendMessage(roleMessage);
          get_role = true;
          roleCounts[role]++;
          break;
        }
      }

      if (!get_role) {
        player.runCommand("tag @s add simin");
        player.runCommand("tag @s add yakumoti");
        player.sendMessage("§7あなたの役職は §r§l市民 §r§7です。");
      }
    }
  });

  const tenseishaCount = objective.getScore("tenseisha");
  for (let i = 0; i < tenseishaCount; i++) {
    sys.runCommand("tag @r[tag=!tenseisha,tag=sanka] add tenseisha");
  }
  system.runTimeout(() => {
    for (const player of world.getPlayers()) {
      if (player.getTags().includes("zinrou_team") || player.getTags().includes("kyosin")) {
        player.runCommand(`execute if entity @a[tag=zinrou] run tellraw @s {"rawtext":[{"text":"§c§l人狼 §r: "},{"selector":"@a[tag=zinrou]"}]}`);
        if (player.getTags().includes("korou")) {
          player.runCommand(`execute if entity @a[tag=korou] run tellraw @s {"rawtext":[{"text":"§7§l子狼 §r: "},{"selector":"@a[tag=korou]"}]}`);
        }
        player.runCommand(`execute if entity @a[tag=tairou] run tellraw @s {"rawtext":[{"text":"§8§l大狼 §r: "},{"selector":"@a[tag=tairou]"}]}`);
        player.runCommand(`execute if entity @a[tag=honrou] run tellraw @s {"rawtext":[{"text":"§c§l翻狼 §r: "},{"selector":"@a[tag=honrou]"}]}`);
        player.runCommand(`execute if entity @a[tag=shokyaku] run tellraw @s {"rawtext":[{"text":"§c§l焼却者 §r: "},{"selector":"@a[tag=shokyaku]"}]}`);
      }
      if (player.getTags().includes("hutago")) {
        player.runCommand(`execute if entity @a[tag=hutago] run tellraw @s {"rawtext":[{"text":"§l双子 §r: "},{"selector":"@a[tag=hutago]"}]}`);
      }
      if (player.getTags().includes("kogitune")) {
        player.runCommand(`execute if entity @a[tag=youko] run tellraw @s {"rawtext":[{"text":"§d§l妖狐 §r: "},{"selector":"@a[tag=youko]"}]}`);
      }
    }
  }, 5);
}

let yakumoti_count = 0;

system.runInterval(() => {
  const roleCount = info_roles.length;
  let objective = world.scoreboard.getObjective("roles");
  for (let i = 0; i < roleCount; i++) {
    const role = info_roles[i];
    if (objective.getScore(`${role.id}`) > 0) {
      sys.runCommand(`scoreboard players operation ${role.prop} info = ${role.id} roles`);
    } else {
      sys.runCommand(`scoreboard players reset ${role.prop} info`);
    }
  }
  if (objective.getScore(`tenseisha`) > 0) {
    sys.runCommand(`scoreboard players operation §2§l転生者 info = tenseisha roles`);
  } else {
    sys.runCommand(`scoreboard players reset §2§l転生者 info`);
  }

  const allPlayers = Array.from(world.getPlayers());
  const sankaPlayers = allPlayers.filter(player => player.getTags().includes("sanka"));
  const comment = "§c§l役持ちの人数が多すぎます";
  let objective_info = world.scoreboard.getObjective("info");
  for (let i = 1; i < roleCount; i++) {
    const role = info_roles[i];
    yakumoti_count += objective.getScore(role.id);
    if (yakumoti_count > sankaPlayers.length) {
      objective_info.setScore(comment, 99);
    } else {
      objective_info.removeParticipant(comment);
    }
  }
  yakumoti_count = 0;
});

system.runInterval(() => {
  let objective = world.scoreboard.getObjective("info");
  const allPlayers = Array.from(world.getPlayers());
  const sankaPlayers = allPlayers.filter(player => player.getTags().includes("sanka"));

  objective.setScore("§e参加人数", sankaPlayers.length);
  objective.setScore("§7人数", allPlayers.length);
});

// Spectate
system.runInterval(() => {
  for (const player of world.getPlayers()) {
    if (player.getTags().includes("spectator")) {
      player.runCommand("gamemode spectator");
      player.runCommand("tp @r[tag=yakumoti]");
      player.runCommand("tag @s add death");
      player.runCommand("tag @s remove spectator");
    }
  }
});


function give_items() {
  let boolean_items = false;
  const number_of_randomitems = items.length;
  for (let i = 0; i < number_of_randomitems; i++) {
    const item = items[i];
    if (world.getDynamicProperty(`${item.prop}`)) {
      boolean_items = true;
      break;
    }
  }

  if (!boolean_items) {
    sys.runCommand(`tellraw @a {"rawtext":[{"text":"§cランダムアイテムがすべて無効化されているため、ランダムアイテムは配布されません "}]}`)
  }
  for (const player of world.getPlayers()) {
    if (player.getTags().includes("sanka")) {
      player.runCommand("scriptevent wj:bow");
      player.runCommand('give @s arrow 1 0 {"item_lock":{"mode":"lock_in_inventory"}}');

      const objective = world.scoreboard.getObjective("count");
      const randomItemsCount = objective.getScore("randomitems");
      if (boolean_items) {
        for (let i = 0; i < randomItemsCount; i++) {
          const randomIndex = Math.floor(Math.random() * number_of_randomitems);
          const item = items[randomIndex];

          if (world.getDynamicProperty(`${item.prop}`)) {
            player.runCommand(`scriptevent ${item.id}`);
          } else {
            i--;
          }
        }
      }

      if (player.getTags().includes("uranai") || player.getTags().includes("stolen_uranai")) {
        player.runCommand("scriptevent wj:uranai");
      } else if (player.getTags().includes("reibai") || player.getTags().includes("stolen_reibai")) {
        player.runCommand("scriptevent wj:reibai");
      } else if (player.getTags().includes("kariudo") || player.getTags().includes("stolen_kariudo")) {
        player.runCommand("scriptevent wj:kariudo");
      } else if (player.getTags().includes("kogitune") || player.getTags().includes("stolen_kogitune")) {
        player.runCommand("scriptevent wj:kogitune_uranai");
      } else if (player.getTags().includes("honrou") || player.getTags().includes("stolen_honrou")) {
        for (let i = 0; i < 3; i++) {
          player.runCommand("scriptevent wj:ookami");
        }
      } else if (player.getTags().includes("kyozin") || player.getTags().includes("stolen_kyozin")) {
        player.runCommand("scriptevent wj:nise_uranai");
        player.runCommand("scriptevent wj:nise_reibai");
      } else if (player.getTags().includes("kyosin") || player.getTags().includes("stolen_kyosin")) {
        player.runCommand("scriptevent wj:nise_uranai");
        player.runCommand("scriptevent wj:nise_reibai");
      } else if (player.getTags().includes("zombie") || player.getTags().includes("stolen_zombie")) {
        player.runCommand("scriptevent wj:zombie");
      } else if (player.getTags().includes("police") || player.getTags().includes("stolen_police")) {
        player.runCommand("scriptevent wj:receiver");
      } else if (player.getTags().includes("shokyaku") || player.getTags().includes("stolen_shokyaku")) {
        for (let i = 0; i < 2; i++) {
          player.runCommand("scriptevent wj:hakka");
        }
      }
    }
  }
};

function choosemap() {

  switch (Number(world.getDynamicProperty("map"))) {
    case (0): // Castle OF ARURU
      sys.runCommand("tp @a[tag=sanka] 11 0 79");
      sys.runCommand("spawnpoint @a[tag=sanka] 11 0 79");
      break;
    case (1): // 屋敷
      sys.runCommand("tp @a[tag=sanka] 61 0 231");
      sys.runCommand("spawnpoint @a[tag=sanka] 61 0 231");
      break;
    case (2): // ソーラーアレイ
      sys.runCommand("tp @a[tag=sanka] 136 12 72");
      sys.runCommand("spawnpoint @a[tag=sanka] 136 12 72");
      break;
    case (3): // Distorted
      sys.runCommand("tp @a[tag=sanka] 107 0 219");
      sys.runCommand("spawnpoint @a[tag=sanka] 107 0 219");
      break;
    case (4): // Kingdom
      sys.runCommand("tp @a[tag=sanka] 14 0 323");
      sys.runCommand("spawnpoint @a[tag=sanka] 14 0 323");
      break;
    case (5): // Paris
      sys.runCommand("tp @a[tag=sanka] 119 0 329");
      sys.runCommand("spawnpoint @a[tag=sanka] 119 0 329");
      break;
    case (6): // New Castle
      sys.runCommand("tp @a[tag=sanka] -103 -28 575");
      sys.runCommand("spawnpoint @a[tag=sanka] -103 -28 575");
      break;
  }

};

// Roles tag
system.runInterval(() => {
  const roleCount = info_roles.length;
  for (const player of world.getPlayers()) {
    for (let i = 0; i < roleCount; i++) {
      const role = info_roles[i];
      if (player.getTags().includes(role.id)) {
        player.runCommand(`tag @s add ${role.uranai}`);
        player.runCommand(`tag @s add ${role.reibai}`);
        player.runCommand(`tag @s add ${role.team}`);
      }
    }
    if (player.getTags().includes("sanka") || !player.getTags().includes("husanka")) {
      player.runCommand("tag @s add sanka");
    }
  }
  sys.runCommand("tag @a[tag=zombie] add infection");
});

// timer
system.runInterval(() => {
  let objective = world.scoreboard.getObjective("timer");

  if (world.getDynamicProperty("playing_game")) {
    objective.addScore("time", -1);
    if (objective.getScore("nazo") === objective.getScore("time")) {
      sys.runCommand("execute as @a run scriptevent wj:nazo");
      sys.runCommand('tellraw @a {"rawtext":[{"text":"§e§lフレアガンが配布されました"}]}');
    }
    if (objective.getScore("time") % 1200 == 0) {
      sys.runCommand("execute as @a[tag=zombie] run scriptevent wj:zombie");
      sys.runCommand('tellraw @a[tag=zombie] {"rawtext":[{"text":"§e§l感染薬が配布されました"}]}');
    }

  } else {
    let timeset = objective.getScore("timeset");
    objective.setScore("time", timeset);
  }
});

system.runInterval(() => {
  let objective = world.scoreboard.getObjective("timer");

  let totalTicks = objective.getScore("time");
  let min = Math.floor(totalTicks / 1200);
  let sec = Math.floor((totalTicks / 20) % 60);

  objective.setScore("min", min);
  objective.setScore("sec", sec);

  if (sec < 10) {
    sys.runCommand('titleraw @a actionbar {"rawtext":[{"text":"§7残り時間§b§l < §e§l"},{"score":{"name":"min","objective":"timer"}},{"text":":0"},{"score":{"name":"sec","objective":"timer"}},{"text":" §b§l>"}]}');
  } else {
    sys.runCommand('titleraw @a actionbar {"rawtext":[{"text":"§7残り時間§b§l < §e§l"},{"score":{"name":"min","objective":"timer"}},{"text":":"},{"score":{"name":"sec","objective":"timer"}},{"text":" §b§l>"}]}');
  }
});

// BGM
let playSoundInterval = 2080;
let tickCount = playSoundInterval;

system.runInterval(() => {
  if (world.getDynamicProperty("bgm") && !world.getDynamicProperty("playing_game")) {
    tickCount++;
    if (tickCount >= playSoundInterval) {
      tickCount = 0;
      for (const player of world.getPlayers()) {
        player.runCommand("playsound sound:bgm @s");
      }
    }
  }
});

// who's winning
system.runInterval(() => {
  const allPlayers = Array.from(world.getPlayers());
  const sankaPlayers = allPlayers.filter(player => player.getTags().includes("sanka"));
  const alive_sankaPlayers = sankaPlayers.filter(player => !player.getTags().includes("death"));
  const zinrou_team_player = allPlayers.filter(player => player.getTags().includes("zinrou_team"));
  const death_zinrou_team_player = zinrou_team_player.filter(player => player.getTags().includes("death"));
  const simin_team_player = allPlayers.filter(player => player.getTags().includes("simin_team"));
  const death_simin_team_player = simin_team_player.filter(player => player.getTags().includes("death"));
  const youko_team_player = allPlayers.filter(player => player.getTags().includes("youko_team"));
  const zombie_team_player = allPlayers.filter(player => player.getTags().includes("zombie_team"));
  const death_zombie_team_player = zombie_team_player.filter(player => player.getTags().includes("death"));
  const death_youko_team_player = youko_team_player.filter(player => player.getTags().includes("death"));
  const infection_player = allPlayers.filter(player => player.getTags().includes("infection"));

  if (world.getDynamicProperty("playing_game")) {
    let objective = world.scoreboard.getObjective("timer");
    if (objective.getScore("time") <= 0) {
      sys.runCommand('title @a title §7ーーーーー §3§l引き分け §r§7ーーーーー');
      if (world.getDynamicProperty("bgm")) {
        for (const player of world.getPlayers()) {
          player.runCommand("playsound sound:hikiwake @s");
        }
      }
      fin_game();
      system.runTimeout(() => {
        sys.runCommand('tellraw @a {"rawtext":[{"text":"§7ーーーーー §3§l引き分け §r§7ーーーーー"}]}');
      }, 98);
    }

    if (zombie_team_player.length != death_zombie_team_player.length) {
      if (infection_player.length === alive_sankaPlayers.length) {
        sys.runCommand('title @a title §7ーーーーー §2§lゾンビ陣営§r§7の§e§l勝利 §r§7ーーーーー');
        if (world.getDynamicProperty("bgm")) {
          for (const player of world.getPlayers()) {
            player.runCommand("playsound sound:zombie @s");
          }
        }
        fin_game();
        system.runTimeout(() => {
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7ーーーーー §2§lゾンビ陣営§r§7の§e§l勝利 §r§7ーーーーー"}]}');
        }, 98);
      }
    }
    if (youko_team_player.length === death_youko_team_player.length) {
      if (simin_team_player.length === death_simin_team_player.length) {
        sys.runCommand('title @a title §7ーーーーー §c§l人狼陣営§r§7の§e§l勝利 §r§7ーーーーー');
        if (world.getDynamicProperty("bgm")) {
          for (const player of world.getPlayers()) {
            player.runCommand("playsound sound:zinrou @s");
          }
        }
        fin_game();
        system.runTimeout(() => {
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7ーーーーー §c§l人狼陣営§r§7の§e§l勝利 §r§7ーーーーー"}]}');
        }, 98);
      } else if (zinrou_team_player.length === death_zinrou_team_player.length) {
        sys.runCommand('title @a title §7ーーーーー §8§l市民陣営§r§7の§e§l勝利 §r§7ーーーーー');
        if (world.getDynamicProperty("bgm")) {
          for (const player of world.getPlayers()) {
            player.runCommand("playsound sound:simin @s");
          }
        }
        fin_game();
        system.runTimeout(() => {
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7ーーーーー §8§l市民陣営§r§7の§e§l勝利 §r§7ーーーーー"}]}');
        }, 98);
      }
    } else {
      if (simin_team_player.length === death_simin_team_player.length || zinrou_team_player.length === death_zinrou_team_player.length) {
        sys.runCommand('title @a title §7ーーーーー §d§l妖狐陣営§r§7の§e§l勝利 §r§7ーーーーー');
        if (world.getDynamicProperty("bgm")) {
          for (const player of world.getPlayers()) {
            player.runCommand("playsound sound:youko @s");
          }
        }
        fin_game();
        system.runTimeout(() => {
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7ーーーーー §d§l妖狐陣営§r§7の§e§l勝利 §r§7ーーーーー"}]}');
        }, 98);
      }
    }
  }
});

// Death
system.runInterval(() => {
  if (world.getDynamicProperty("sigai")) {
    sys.runCommand("replaceitem entity @e[type=armor_stand,name=sigai] slot.armor.head 1 skull 1 0");
    sys.runCommand("effect @e[type=armor_stand,name=sigai] invisibility 1 0 true");
    sys.runCommand("clear @a skull 0");
    sys.runCommand("execute as @e[type=armor_stand,name=sigai] at @s run tp @s ^^^");
  }
});

world.afterEvents.entityDie.subscribe(event => {
  const { damageSource, deadEntity } = event;

  if (deadEntity.typeId === "minecraft:player" && deadEntity.getTags().includes("sanka")) {
    if (world.getDynamicProperty("sigai"))
      deadEntity.runCommand(`summon armor_stand ~~-1.5~ facing ^^^1 born_default sigai`);

    if (deadEntity.getTags().includes("korou")) {
      deadEntity.runCommand(`execute as @r[tag=zinrou_team,tag=!death,name=!${deadEntity.nameTag}] at @s run scriptevent wj:shinryu_ken`);
    } else if (deadEntity.getTags().includes("hutago")) {
      system.runTimeout(() => {
        deadEntity.runCommand(`kill @a[tag=hutago,tag=!death]`);
        deadEntity.runCommand('tellraw @a[tag=hutago,tag=!death] {"rawtext":[{"text":"§7双子の１人が死んでしまい、後追いした。"}]}');
      }, 30 * 20);
    }

    if (damageSource.damagingEntity && (damageSource.damagingEntity.typeId === "minecraft:player")) {
      const killer = damageSource.damagingEntity;
      deadEntity.sendMessage(`§7あなたは §e${killer.nameTag} §7に殺されました...`);
      if (!deadEntity.getTags().includes("tenseisha")) {
        deadEntity.runCommand(`tp ${killer.nameTag}`);
      }
    }

    if (deadEntity.getTags().includes("tenseisha")) {
      const roleCount = info_roles.length;
      for (let i = 0; i < roleCount; i++) {
        let role = info_roles[i];
        if (deadEntity.getTags().includes(`${role.id}`)) {
          deadEntity.runCommand(`tag @s remove ${role.id}`);
          deadEntity.runCommand(`tag @s add re_${role.id}`);
        }
      }
      deadEntity.runCommand(`tag @s remove siro`);
      deadEntity.runCommand(`tag @s remove r_siro`);
      deadEntity.runCommand(`tag @s remove kuro`);
      deadEntity.runCommand(`tag @s remove r_kuro`);
      deadEntity.runCommand(`tag @s remove r_tairou`);
      deadEntity.runCommand(`tag @s remove simin_team`);
      deadEntity.runCommand(`tag @s remove kyozin_team`);
      deadEntity.runCommand(`tag @s remove zinrou_team`);
      deadEntity.runCommand(`tag @s remove youko_team`);
      deadEntity.runCommand(`tag @s remove zombie_team`);

      deadEntity.runCommand(`tag @s remove infection`);

      const randomIndex = Math.floor(Math.random() * 2);

      if (randomIndex === 0) {
        deadEntity.runCommand("tag @s add simin");
        deadEntity.sendMessage(`§7あなたは転生者であったので§r§l市民§r§7になりました`);
      } else {
        deadEntity.runCommand("tag @s add zinrou");
        deadEntity.sendMessage(`§7あなたは転生者であったので§c§l人狼§r§7になりました`);
      }
      deadEntity.runCommand("scriptevent wj:bow");
      deadEntity.runCommand('give @s arrow 1 0 {"item_lock":{"mode":"lock_in_inventory"}}');
      deadEntity.runCommand(`tag @s remove tenseisha`);
    } else {
      deadEntity.runCommand(`tag @s add death`);
      deadEntity.sendMessage("§e- TP コマンド -");
      deadEntity.sendMessage("§7- !tp list - §rTPできる人のリストを表示");
      deadEntity.sendMessage("§7- !tp {プレイヤーの名前} - §r{プレイヤーの名前}の人にTP");
      deadEntity.sendMessage("§7- !tp @r - §rランダムな人にTP");

      deadEntity.runCommand(`gamemode spectator @s`);
    }
  }
});

world.beforeEvents.chatSend.subscribe((event) => {
  const { sender, message } = event;
  if (sender.getTags().includes("death")) {
    event.cancel = true;
    if (message.startsWith("!tp ")) {
      const msg = message.split(" ")[1];
      const players = world.getPlayers();
      const targetPlayer = players.find(player => player.nameTag === msg);
      if (msg === "list") {
        sender.sendMessage(`§e- TPできるプレイヤー -`);
        players.forEach(player => {
          sender.sendMessage(`§7${player.nameTag}`);
        })
      } else if (msg === "@r") {
        sender.runCommandAsync(`tp @s @r[tag=sanka,tag=!death]`);
      } else {
        sender.runCommandAsync(`tp @s ${targetPlayer.nameTag}`);
      }
    } else {
      sender.runCommandAsync(`tellraw @a[tag=death] {"rawtext":[{"text":"§7[§b 霊界 §7] §r<${sender.nameTag}> ${message}"}]}`);
    }
  }
});

// Setting Game Commands

if (world.getDynamicProperty("time") === undefined) {
  world.setDynamicProperty("time", 0);
}
if (world.getDynamicProperty("sizen") === undefined) {
  world.setDynamicProperty("sizen", true);
}
if (world.getDynamicProperty("weather") === undefined) {
  world.setDynamicProperty("weather", 0);
}
if (world.getDynamicProperty("keep") === undefined) {
  world.setDynamicProperty("keep", true);
}
if (world.getDynamicProperty("sigai") === undefined) {
  world.setDynamicProperty("sigai", true);
}
if (world.getDynamicProperty("rakka") === undefined) {
  world.setDynamicProperty("rakka", false);
}
if (world.getDynamicProperty("asiato") === undefined) {
  world.setDynamicProperty("asiato", false);
}
if (world.getDynamicProperty("siten") === undefined) {
  world.setDynamicProperty("siten", false);
}
system.afterEvents.scriptEventReceive.subscribe((ev) => {
  const { id } = ev;
  let i, boolean;
  switch (id) {
    case ("toggle:time"):
      i = world.getDynamicProperty("time");
      world.setDynamicProperty("time", ++i);
      switch (world.getDynamicProperty("time") % 2) {
        case (0):
          sys.runCommand("time set day");
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] 時間を §e§l昼 §r§7にしました"}]}');
          break;
        case (1):
          sys.runCommand("time set midnight");
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] 時間を §e§l夜 §r§7にしました"}]}');
          break;
      }
      break;
    case ("toggle:weather"):
      i = world.getDynamicProperty("weather");
      world.setDynamicProperty("weather", ++i);
      switch (world.getDynamicProperty("weather") % 3) {
        case (0):
          sys.runCommand("weather clear");
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] 天気を §e§l晴れ §r§7にしました"}]}');
          break;
        case (1):
          sys.runCommand("weather rain");
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] 天気を §e§l雨 §r§7にしました"}]}');
          break;
        case (2):
          sys.runCommand("weather thunder");
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] 天気を §e§l雷雨 §r§7にしました"}]}');
          break;
      }
      break;
    case ("toggle:sizen"):
      boolean = !world.getDynamicProperty("sizen");
      world.setDynamicProperty("sizen", boolean);
      switch (world.getDynamicProperty("sizen")) {
        case (true):
          sys.runCommand("gamerule naturalregeneration true");
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§l自然再生 §r§7を §e§l有効化 §r§7にしました"}]}');
          break;
        case (false):
          sys.runCommand("gamerule naturalregeneration false");
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§l自然再生 §r§7を §e§l無効化 §r§7にしました"}]}');
          break;
      }
      break;
    case ("toggle:keep"):
      boolean = !world.getDynamicProperty("keep");
      world.setDynamicProperty("keep", boolean);
      switch (world.getDynamicProperty("keep")) {
        case (true):
          sys.runCommand("gamerule keepinventory true");
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§lキープインベントリ §r§7を §e§l有効化 §r§7にしました"}]}');
          break;
        case (false):
          sys.runCommand("gamerule keepinventory false");
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§lキープインベントリ §r§7を §e§l無効化 §r§7にしました"}]}');
          break;
      }
      break;
    case ("toggle:sigai"):
      boolean = !world.getDynamicProperty("sigai");
      world.setDynamicProperty("sigai", boolean);
      switch (world.getDynamicProperty("sigai")) {
        case (true):
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§l死骸 §r§7を §e§l有効化 §r§7にしました"}]}');
          break;
        case (false):
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§l死骸 §r§7を §e§l無効化 §r§7にしました"}]}');
          break;
      }
      break;
    case ("toggle:rakka"):
      boolean = !world.getDynamicProperty("rakka");
      world.setDynamicProperty("rakka", boolean);
      switch (world.getDynamicProperty("rakka")) {
        case (true):
          sys.runCommand("gamerule falldamage true");
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§l落下ダメージ §r§7を §e§l有効化 §r§7にしました"}]}');
          break;
        case (false):
          sys.runCommand("gamerule falldamage false");
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§l落下ダメージ §r§7を §e§l無効化 §r§7にしました"}]}');
          break;
      }
      break;
    case ("toggle:asiato"):
      boolean = !world.getDynamicProperty("asiato");
      world.setDynamicProperty("asiato", boolean);
      switch (world.getDynamicProperty("asiato")) {
        case (true):
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§l足跡 §r§7を §e§l有効化 §r§7にしました"}]}');
          sys.runCommand("execute as @a[tag=sanka,m=!spectator] run particle minecraft:balloon_gas_particle ~~~");
          break;
        case (false):
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§l足跡 §r§7を §e§l無効化 §r§7にしました"}]}');
          break;
      }
      break;
    case ("toggle:siten"):
      boolean = !world.getDynamicProperty("siten");
      world.setDynamicProperty("siten", boolean);
      switch (world.getDynamicProperty("siten")) {
        case (true):
          sys.runCommand("camera @a[tag=sanka] set minecraft:first_person");
          sys.runCommand("camera @a[tag=!sanka] clear");
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§l視点の固定 §r§7を §e§l有効化 §r§7にしました"}]}');
          break;
        case (false):
          sys.runCommand("camera @a clear");
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§l視点の固定 §r§7を §e§l無効化 §r§7にしました"}]}');
          break;
      }
      break;
    case ("toggle:bgm"):
      boolean = !world.getDynamicProperty("bgm");
      world.setDynamicProperty("bgm", boolean);
      switch (world.getDynamicProperty("bgm")) {
        case (true):
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§lBGM §r§7を §e§l有効化 §r§7にしました"}]}');
          sys.runCommand("playsound sound:bgm @a");
          break;
        case (false):
          sys.runCommand('tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§lBGM §r§7を §e§l無効化 §r§7にしました"}]}');
          sys.runCommand("stopsound @a");
          break;
      }
      break;
  }
});

system.runInterval(() => {
  if (world.getDynamicProperty("asiato")) {
    sys.runCommand("execute as @a[tag=sanka,m=!spectator] at @s run particle minecraft:balloon_gas_particle ~~~");
  }

  switch (world.getDynamicProperty("siten")) {
    case (true):
      sys.runCommand("camera @a[tag=sanka] set minecraft:first_person");
      sys.runCommand("camera @a[tag=!sanka] clear");
      break;
    case (false):
      sys.runCommand("camera @a clear");
      break;
  }
});

system.afterEvents.scriptEventReceive.subscribe((ev) => {
  const { id } = ev;
  const count = items.length;
  for (let i = 0; i < count; i++) {
    let item = items[i];
    if (`item:${item.prop}` === id) {
      let on_off = !world.getDynamicProperty(`${item.prop}`);
      if (on_off) {
        world.setDynamicProperty(`${item.prop}`, true);
        sys.runCommand(`tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§l${item.name} §r§7を §e§l有効化 §r§7にしました"}]}`);
      } else {
        world.setDynamicProperty(`${item.prop}`, false);
        sys.runCommand(`tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §e§l${item.name} §r§7を §e§l無効化 §r§7にしました"}]}`);
      }
    }
  }
});

system.afterEvents.scriptEventReceive.subscribe((ev) => {
  const { id, message, sourceEntity } = ev;
  switch (id) {
    case ("game:map"):
      set_map(message, sourceEntity);
      break;

    case ("game:start"):
      clear_role();
      start_game();
      break;

    case ("game:give"):
      give_items();
      break;

    case ("game:role"):
      player_roles();
      break;

    case ("game:fin"):
      fin_game();
      break;

    case ("game:clear_role"):
      clear_role();
      break;

    case ("game:kaitou"):
      steal_kaitou();
      break;

    case ("game:bgm"):
      if (message === "on") {
        sourceEntity.sendMessage("§7[§e 設定 §7] BGMをオンにしました");
        world.setDynamicProperty("bgm", true);
        player.runCommand("playsound sound:bgm @s");
        tickCount = playSoundInterval;
      } else if (message === "off") {
        sourceEntity.sendMessage("§7[§e 設定 §7] BGMをオフにしました");
        world.setDynamicProperty("bgm", false);
        sourceEntity.runCommand("stopsound @a");
      }
      break;

    case ("game:nazo"):
      let objective = world.scoreboard.getObjective("timer");
      let nazo = Math.floor(objective.getScore("nazo") / 1200);
      sys.runCommand(`tellraw @a {"rawtext":[{"text":"§7[§e 設定 §7] §7フレアガン配布時間§e§l ${nazo}:00"}]}`);
      break;

    case ("game:spec"):
      if (world.getDynamicProperty("playing_game")) {
        sourceEntity.runCommand(`playsound ominous_item_spawner.spawn_item_begin @s`);
        sourceEntity.runCommand(`tellraw @s {"rawtext":[{"text":"§7[§e 設定 §7] §7観戦モードになりました"}]}`);
        sourceEntity.runCommand(`tellraw @s {"rawtext":[{"text":"§e- TP コマンド -"}]}`);
        sourceEntity.runCommand(`tellraw @s {"rawtext":[{"text":"§7- !tp list - §rTPできる人のリストを表示"}]}`);
        sourceEntity.runCommand(`tellraw @s {"rawtext":[{"text":"§7- !tp {プレイヤーの名前} - §r{プレイヤーの名前}の人にTP"}]}`);
        sourceEntity.runCommand(`tellraw @s {"rawtext":[{"text":"§7- !tp @r - §rランダムな人にTP"}]}`);
        sourceEntity.runCommand("tag @s add spectator");
      } else {
        sourceEntity.runCommand(`playsound ominous_item_spawner.spawn_item @s`);
        sourceEntity.runCommand(`tellraw @s {"rawtext":[{"text":"§7[§e 設定 §7] §c現在は試合が始まっていません"}]}`);
      }
      break;

    case ("game:test"):
      kaitou(sourceEntity);
  }
});

function steal_kaitou() {
  const allPlayers = Array.from(world.getPlayers());
  const sankaPlayers = allPlayers.filter(player => player.getTags().includes("sanka"));
  for (const player of sankaPlayers) {
    if (player.getTags().includes("kaitou")) {
      let targetPlayer = player;
      if (sankaPlayers.length === 1) {
        player.sendMessage("Error :player > 1");
        return;
      }
      while (!targetPlayer || targetPlayer === player) {
        let randomIndex = Math.floor(Math.random() * sankaPlayers.length);
        targetPlayer = sankaPlayers[randomIndex];
      }
      for (let i = 0; i < info_roles.length; i++) {
        let role = info_roles[i];
        if (targetPlayer.getTags().includes(role.id)) {

          player.runCommand(`tellraw @s {"rawtext":[{"text":"§7[§a 怪盗 §7] §e${targetPlayer.nameTag} §7の役職を盗み、 ${role.prop} §r§7になりました。"}]}`);
          player.runCommand(`tag @s remove kaitou`);
          player.runCommand(`tag @s add stole_kaitou`);
          player.runCommand(`tag @s remove siro`);
          player.runCommand(`tag @s remove r_siro`);
          player.runCommand(`tag @s remove simin_team`);
          player.runCommand(`tag @s add ${role.id}`);

          targetPlayer.runCommand(`tag @s remove ${role.id}`);
          targetPlayer.runCommand(`tag @s add stolen_${role.id}`);
          targetPlayer.runCommand(`tag @s remove siro`);
          targetPlayer.runCommand(`tag @s remove kuro`);
          targetPlayer.runCommand(`tag @s remove r_siro`);
          targetPlayer.runCommand(`tag @s remove r_kuro`);
          targetPlayer.runCommand(`tag @s remove simin_team`);
          targetPlayer.runCommand(`tag @s remove kyozin_team`);
          targetPlayer.runCommand(`tag @s remove zinrou_team`);
          targetPlayer.runCommand(`tag @s remove youko_team`);
          targetPlayer.runCommand(`tag @s remove zombie_team`);
          targetPlayer.runCommand(`tag @s add simin`);

          player.runCommand(`playsound vault.open_shutter`);
          break;
        }
      }
    }
  }
}

function start_game() {
  clear_role();
  let objective = world.scoreboard.getObjective("timer");

  sys.runCommand("title @a title §7ーーーーー §e§lゲームスタート §r§7ーーーーー");
  sys.runCommand("title @a subtitle §7１０秒後に開始します");
  sys.runCommand("effect @a[tag=sanka] invisibility 10 0 true");
  sys.runCommand("effect @a[tag=sanka] speed 10 20 true");
  sys.runCommand("effect @a[tag=sanka] resistance 10 255 true");
  sys.runCommand("gamemode 2 @a[tag=sanka]");
  sys.runCommand("clear @a[tag=sanka]");


  let timeset = objective.getScore("timeset");
  let nazo = Math.floor(objective.getScore("nazo") / 1200);
  objective.setScore("time", timeset);
  sys.runCommand(`tellraw @a {"rawtext":[{"text":"§7フレアガン配布時間§e§l ${nazo}:00"}]}`);

  choosemap();
  player_roles();

  const sanka_player = [];
  for (const player of world.getPlayers()) {
    if (player.getTags().includes("sanka")) {
      sanka_player.push(player);
    }
  }
  // for (const source of world.getPlayers()) {
  //   if (source.getTags().includes("kaitou")) {
  //     source.sendMessage("§7--- §e役職を奪うことができる人 §7---");
  //     sanka_player.forEach(player => {
  //       source.sendMessage(player.nameTag);
  //     })
  //     source.sendMessage('§7[§a 怪盗 §7] §7チャットで "!n [奪う人の名前]" で役職を奪う');
  //     source.sendMessage('§c試合開始までに奪う人を選択しなかった場合、ランダムになります');
  //   }
  // }
  sys.runCommand("execute as @a[tag=kaitou] run scriptevent wj:kaitou");
  system.runTimeout(() => {
    steal_kaitou();
    give_items();
    sys.runCommand("clear @a wj:kaitou");
    sys.runCommand("stopsound @a");
    world.setDynamicProperty("playing_game", true);
  }, 200);
}

function fin_game() {
  system.runTimeout(() => {
    sys.runCommand("clear @a[tag=sanka]");
    sys.runCommand("spawnpoint @a -53 -24 -20");
    sys.runCommand("tp @a -53 -24 -20");
    sys.runCommand("kill @e[type=item]");
    sys.runCommand("gamemode 2 @a");
    sys.runCommand("gamemode 1 @a[tag=op]");
    sys.runCommand("kill @e[type=armor_stand,name=sigai]");
    view_role();
    clear_role();
    tickCount = playSoundInterval - 140;
  }, 100);
  world.setDynamicProperty("playing_game", false);
}

// Repeat Commands
system.runInterval(() => {
  let objective = world.scoreboard.getObjective("count");

  if (!objective) {
    objective = world.scoreboard.addObjective("count");
  }

  const armorStands = world.getDimension("overworld").getEntities({
    type: "minecraft:armor_stand",
    name: "sigai"
  });
  const sigai_count = armorStands.length;

  let participant = objective.getParticipants().find(p => p.displayName === "sigai");

  if (!participant) {
    world.getDimension("overworld").runCommand("scoreboard players set sigai count 0");
    participant = objective.getParticipants().find(p => p.displayName === "sigai");
  }
  if (participant) {
    objective.setScore(participant, sigai_count);
  }
});

// Repeat Items
system.runInterval(() => {
  sys.runCommand(`execute as @a[hasitem={item=wj:sensor,location=slot.weapon.mainhand},m=!spectator] at @s if entity @a[m=!spectator,rm=0.1,r=10] run title @s actionbar §e§l半径１０マス以内に人がいます`);
  sys.runCommand(`execute as @a[hasitem={item=wj:sensor,location=slot.weapon.mainhand},m=!spectator] at @s unless entity @a[m=!spectator,rm=0.1,r=10] run title @s actionbar §7半径１０マス以内に人がいません`);

  sys.runCommand('execute as @a[hasitem={item=wj:himo,location=slot.weapon.mainhand}] at @s run title @s actionbar §4§l一番近くの生きている誰かとひもで結ばれている...');
  sys.runCommand(`execute as @a[hasitem={item=wj:himo,location=slot.weapon.mainhand}] at @s run tp @s ~~~ facing @p[rm=0.1,m=!spectator]`);

  sys.runCommand('execute as @a[hasitem={item=wj:nazo,location=slot.weapon.mainhand},m=!spectator] at @s run title @s actionbar §e§l一番近くの生きている人の方向にパーティクルが出る...');
  sys.runCommand(`execute as @a[hasitem={item=wj:nazo,location=slot.weapon.mainhand},m=!spectator] at @s facing entity @p[rm=0.1,m=!spectator] feet positioned ^^1^2 run particle minecraft:obsidian_glow_dust_particle`);

  sys.runCommand(`execute if entity @e[type=armor_stand,name=sigai] as @a[hasitem={item=wj:receiver,location=slot.weapon.mainhand},tag=police,m=!spectator] at @s run titleraw @s actionbar {"rawtext":[{"text":"§7死体の数は §c"},{"score":{"name":"sigai","objective":"count"}},{"text":" §7体です"}]}`);
  sys.runCommand(`execute unless entity @e[type=armor_stand,name=sigai] as @a[hasitem={item=wj:receiver,location=slot.weapon.mainhand},tag=police,m=!spectator] at @s run title @s actionbar §7死体はありません`);
  sys.runCommand(`execute as @a[hasitem={item=wj:receiver,location=slot.weapon.mainhand},tag=!police,m=!spectator] at @s run title @s actionbar §7なぜか使うことができない...`);
});

// system.runInterval(() => {
//   for (const player of world.getPlayers()) {
//     const inventory = player.getComponent("inventory");
//     const slot = inventory.container.getSlot(player.selectedSlotIndex);

//     switch (slot.typeId) {
//       case ("wj:sensor"):
//         player.runCommand(`execute at @s if entity @a[m=!spectator,rm=0.1,r=10] run title @s actionbar §e§l半径１０マス以内に人がいます`);
//         player.runCommand(`execute at @s unless entity @a[m=!spectator,rm=0.1,r=10] run title @s actionbar §7半径１０マス以内に人がいません`);
//         break;

//       case ("wj:himo"):
//         player.onScreenDisplay.setActionBar("§4§l一番近くの生きている誰かとひもで結ばれている...");
//         player.runCommand(`execute at @s run tp @s ~~~ facing @p[rm=0.1,m=!spectator]`);
//         break;

//       case ("wj:nazo"):
//         player.onScreenDisplay.setActionBar("§e§l一番近くの生きている人の方向にパーティクルが出る...");
//         player.runCommand(`execute at @s facing entity @p[rm=0.1,m=!spectator] feet positioned ^^^2 run particle minecraft:villager_happy`);
//         break;

//       case ("wj:receiver"):
//         if (player.getTags().includes("police")) {
//           let objective = world.scoreboard.getObjective("count");
//           let sigai = objective.getParticipants().find(p => p.displayName === "sigai");

//           if (objective.getScore(sigai) >= 1) {
//             player.runCommand(`execute at @s run titleraw @s actionbar {"rawtext":[{"text":"§7死体の数は §c"},{"score":{"name":"sigai","objective":"count"}},{"text":" §7体です"}]}`);
//           } else {
//             player.runCommand(`execute at @s run title @s actionbar §7死体はありません`);
//           }
//         } else {
//           player.runCommand(`execute at @s run title @s actionbar §7なぜか使うことができない...`);
//         }
//         break;
//     }
//   }
// });

// Right Click Items
world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent(
    "wj:touketu",
    {
      onUse({ source }) {
        source.runCommand("tag @s add touketu");
        source.runCommand("effect @a[tag=!touketu,m=!spectator] slowness 5 255 true");
        source.runCommand("title @a title §l§3誰かにより凍結された！");
        source.runCommand("playsound random.glass @a");
        source.runCommand("clear @s wj:touketu 0 1");
        source.runCommand("tag @a remove touketu");
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:uranai",
    {
      onUse({ source }) {
        // const sanka_player = [];
        // for (const player of world.getPlayers()) {
        //   if (player.getTags().includes("sanka")) {
        //     sanka_player.push(player);
        //   }
        // }
        // source.sendMessage("§7--- §e占うことができる人 §7---");
        // sanka_player.forEach(player => {
        //   source.sendMessage(player.nameTag);
        // })
        // source.runCommand("playsound block.enchanting_table.use");
        // source.sendMessage(`§7チャットで "!u [占う人の名前]" で占う`);

        uranai(source);
        source.runCommand("playsound block.enchanting_table.use");
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:reibai",
    {
      onUse({ source }) {
        // const sanka_player = [];
        // for (const player of world.getPlayers()) {
        //   if (player.getTags().includes("sanka")) {
        //     sanka_player.push(player);
        //   }
        // }
        // source.sendMessage("§7--- §e霊媒することができる人 §7---");
        // sanka_player.forEach(player => {
        //   source.sendMessage(player.nameTag);
        // })
        // source.runCommand("playsound block.enchanting_table.use");
        // source.sendMessage(`§7チャットで "!r [霊媒する人の名前]" で霊媒する`);

        reibai(source);
        source.runCommand("playsound block.enchanting_table.use");
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:kariudo",
    {
      onUse({ source }) {
        // const sanka_player = [];
        // for (const player of world.getPlayers()) {
        //   if (player.getTags().includes("sanka")) {
        //     sanka_player.push(player);
        //   }
        // }
        // source.sendMessage("§7--- §e護衛することができる人 §7---");
        // sanka_player.forEach(player => {
        //   source.sendMessage(player.nameTag);
        // })
        // source.runCommand("playsound block.enchanting_table.use");
        // source.sendMessage(`§7チャットで "!k [護衛する人の名前]" で護衛する`);

        kariudo(source);
        source.runCommand("playsound block.enchanting_table.use");
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:kaitou",
    {
      onUse({ source }) {
        kaitou(source);
        source.runCommand("playsound block.enchanting_table.use");
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:gisou",
    {
      onUse({ source }) {
        source.runCommand("playsound random.bow @a ^^^-5");
        system.runTimeout(() => {
          source.runCommand("playsound random.bowhit @a ^^^-3");
        }, 10);
        source.runCommand("clear @s wj:gisou 0 1");
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:kusuri",
    {
      onUse({ source }) {
        source.runCommand("playsound random.levelup");
        source.runCommand("effect @s clear");
        source.sendMessage("§7[§7 魔法の薬 §7] §7すべてのエフェクト効果を打ち消しました");
        source.runCommand("clear @s wj:kusuri 0 1");
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:uranai_me",
    {
      onUse({ source }) {
        source.runCommand("playsound break.amethyst_block");

        const sanka_players = [];

        for (const player of world.getPlayers()) {
          if (player.getTags().includes("sanka") && player !== source) {
            sanka_players.push(player);
          }
        }
        if (sanka_players.length > 0) {
          const randomIndex = Math.floor(Math.random() * sanka_players.length);
          const targetPlayer = sanka_players[randomIndex];
          const tags = targetPlayer.getTags();
          if (tags.includes("kuro")) {
            source.runCommand(`tellraw @s {"rawtext":[{"text":"§7[§d 占い §7] §e${targetPlayer.nameTag} §7は §8§l黒 §7です。"}]}`);
          } else if (tags.includes("siro")) {
            source.runCommand(`tellraw @s {"rawtext":[{"text":"§7[§d 占い §7] §e${targetPlayer.nameTag} §7は §r§l白 §7です。"}]}`);
          }
        }
        source.runCommand("clear @s wj:uranai_me 0 1");
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:sinzitu",
    {
      onUse({ source }) {
        source.runCommand("playsound beacon.activate");
        source.runCommand("tag @s add source_sinzitu");
        source.runCommand("tag @r[tag=!source_sinzitu,tag=sanka,r=5,m=!spectator] add target_sinzitu");
        const roleCount = info_roles.length;
        for (let i = 0; i < roleCount; i++) {
          let role = info_roles[i];
          source.runCommand(`execute if entity @a[tag=target_sinzitu,tag=${role.id}] run tellraw @a[tag=source_sinzitu] {"rawtext":[{"text":"§7[§9 真実の目 §7]  §7半径５マスに${role.prop}がいます。"}]}`);
        }

        source.runCommand("tag @a remove source_sinzitu");
        source.runCommand("tag @a remove target_sinzitu");
        source.runCommand("clear @s wj:sinzitu 0 1");
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:ankoku",
    {
      onUse({ source }) {
        source.runCommand("tag @s add ankoku");
        source.runCommand("effect @a[tag=!ankoku,m=!spectator] blindness 10 0 true");
        source.runCommand("title @a title §l§8誰かにより暗黒にされた！");
        source.runCommand("playsound mob.warden.emerge @a");
        source.runCommand("clear @s wj:ankoku 0 1");
        source.runCommand("tag @a remove ankoku");
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:kago",
    {
      onUse({ source }) {
        source.runCommand("effect @s resistance 3 255 true");
        source.runCommand("playsound mob.wither.ambient");
        source.runCommand(`tellraw @s {"rawtext":[{"text":"§7[§c ドラゴンの加護 §7] §7ドラゴンの加護により３秒間無敵になった"}]}`);
        source.runCommand("clear @s wj:kago 0 1");
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:kinomi",
    {
      onUse({ source }) {
        source.runCommand("effect @a[r=2] invisibility 15 0 true");
        source.runCommand("playsound mob.ghast.scream @a[tag=sanka]");
        source.runCommand(`tellraw @a[r=2] {"rawtext":[{"text":"§7[§6 スケスケの実 §7] §7実を使ったことで１５秒間透明になった"}]}`);
        source.runCommand("clear @s wj:kinomi 0 1");
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:usagi",
    {
      onUse({ source }) {
        source.runCommand("effect @a[r=2] jump_boost 45 2 true");
        source.runCommand("playsound mob.llama.angry @a[r=2,m=!spectator]");
        source.runCommand(`tellraw @a[r=2] {"rawtext":[{"text":"§7[§a うさぎの靴 §7] §7うさぎの力で４５秒間ジャンプ力が上昇した"}]}`);
        source.runCommand("clear @s wj:usagi 0 1");
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:hayabusa",
    {
      onUse({ source }) {
        source.runCommand("effect @a[r=2] speed 30 10 true");
        source.runCommand("playsound mob.elderguardian.hit @a[r=2,m=!spectator]");
        source.runCommand(`tellraw @a[r=2] {"rawtext":[{"text":"§7[§b ハヤブサの羽根 §7] §7ハヤブサの力で３０秒間スピードが上昇した"}]}`);
        source.runCommand("clear @s wj:hayabusa 0 1");
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:ookami",
    {
      onUse({ source }) {
        if (source.getTags().includes("honrou")) {
          source.runCommand("execute as @a[tag=sanka,m=!spectator] at @s run summon wolf ^^^ facing ^^^10 minecraft:ageable_grow_up §7§l狼の幻");
          source.runCommand("playsound mob.wolf.bark @a");
          source.runCommand("title @a title §l§7翻狼により狼にされた！");
          source.runCommand("clear @s wj:ookami 0 1");
        } else {
          source.sendMessage("§7なぜか使うことができない...");
          source.runCommand("playsound mob.witch.celebrate");
        }
        let timer = 0;
        const intervalId = system.runInterval(() => {
          if (timer <= 10 * 20) {
            source.runCommand("execute as @a[tag=sanka,m=!spectator] at @s run tp @e[r=3,c=1,type=wolf,name=§7§l狼の幻] ~~~ facing ^^^1");
            source.runCommand("execute as @e[type=wolf,name=§7§l狼の幻] at @s run effect @a[r=2] invisibility 1 0 true");
            timer++;
          } else {
            source.runCommand("kill @e[type=wolf,name=§7§l狼の幻]");
            system.clearRun(intervalId);
          }
        }, 1);
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:zombie",
    {
      onUse({ source }) {
        if (source.getTags().includes("zombie")) {
          const sanka_players = [];

          for (const player of world.getPlayers()) {
            if (!player.getTags().includes("infection") && player.getTags().includes("sanka") && !player.getTags().includes("death")) {
              sanka_players.push(player);
            }
          }

          if (sanka_players.length > 0) {
            const randomIndex = Math.floor(Math.random() * sanka_players.length);
            const targetPlayer = sanka_players[randomIndex];

            source.runCommand(`tag ${targetPlayer.nameTag} add infection`);
            source.runCommand(`tellraw @s {"rawtext":[{"text":"§7[§2 感染 §7] §e${targetPlayer.nameTag} §7に感染させました。"}]}`);
            source.runCommand("playsound mob.zombie.say");
            source.runCommand("clear @s wj:zombie 0 1");
          }
        } else {
          source.sendMessage("§7なぜか使うことができない...");
          source.runCommand("playsound mob.witch.celebrate");
        }
      }
    }
  );

  itemComponentRegistry.registerCustomComponent(
    "wj:hakka",
    {
      onUse({ source }) {
        if (source.getTags().includes("shokyaku")) {
          source.runCommand("kill @e[type=armor_stand,name=sigai,r=3]");
          source.runCommand("playsound random.fuse");
          source.runCommand(`tellraw @s {"rawtext":[{"text":"§7[§c 発火装置 §7] §7周囲３マスの死体を焼却しました。"}]}`);
          source.runCommand("clear @s wj:hakka 0 1");
        } else {
          source.sendMessage("§7なぜか使うことができない...");
          source.runCommand("playsound mob.witch.celebrate");
        }
      }
    }
  );
});

// Custom Commands
// world.beforeEvents.chatSend.subscribe((event) => {

//   const { sender, message } = event;

//   if (message.startsWith("!u ")) {
//     event.cancel = true;
//     const playerName = message.split(" ")[1];
//     const players = world.getPlayers();
//     const targetPlayer = players.find(player => player.nameTag === playerName);

//     if (targetPlayer === undefined || !targetPlayer.getTags().includes("sanka")) {
//       sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§d 占い §7] §e${playerName} §7はいません。"}]}`);
//       sender.runCommandAsync(`playsound block.grindstone.use`);
//       return;
//     }

//     const tags = targetPlayer.getTags();
//     const inventory = sender.getComponent("inventory");
//     const slot = inventory.container.getSlot(sender.selectedSlotIndex);

//     if (slot.typeId == "wj:uranai") {
//       if (sender.getTags().includes("uranai") || sender.getTags().includes("kogitune")) {

//         if (tags.includes("kuro")) {
//           sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§d 占い §7] §e${playerName} §7は §8§l黒 §7です。"}]}`);

//         } else if (tags.includes("siro")) {
//           sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§d 占い §7] §e${playerName} §7は §r§l白 §r§7です。"}]}`);
//         }

//         if (tags.includes("youko")) {
//           sender.runCommandAsync(`kill ${playerName}`);
//         }

//         sender.runCommandAsync(`playsound respawn_anchor.deplete`);
//         sender.runCommandAsync(`clear @s wj:uranai 0 1`);

//       } else if (sender.getTags().includes("stolen_uranai")) {
//         sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§d 占い §7] §e${playerName} §7は §r§l白 §r§7です。"}]}`);
//         sender.runCommandAsync(`playsound respawn_anchor.set_spawn`);
//         sender.runCommandAsync(`clear @s wj:uranai 0 1`);

//       } else {
//         sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§d 占い §7] §7あなたは占いか子狐ではありません。"}]}`);
//         sender.runCommandAsync(`playsound respawn_anchor.charge`);
//       }

//     } else {
//       sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§d 占い §7] §7手に §d占いの棒 §7を持ってください。"}]}`);
//       sender.runCommandAsync(`playsound respawn_anchor.charge`);
//     }

//   } else if (message.startsWith("!r ")) {
//     event.cancel = true;
//     const playerName = message.split(" ")[1];
//     const players = world.getPlayers();
//     const targetPlayer = players.find(player => player.nameTag === playerName);

//     if (targetPlayer === undefined || !targetPlayer.getTags().includes("sanka")) {
//       sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §e${playerName} §7はいません。"}]}`);
//       sender.runCommandAsync(`playsound block.grindstone.use`);
//       return;
//     }

//     const tags = targetPlayer.getTags();
//     const inventory = sender.getComponent("inventory");
//     const slot = inventory.container.getSlot(sender.selectedSlotIndex);

//     if (slot.typeId == "wj:reibai") {

//       if (sender.getTags().includes("reibai")) {

//         if (tags.includes("r_kuro") && tags.includes("death")) {
//           sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §e${playerName} §7は §8§l黒 §7です。"}]}`);
//         } else if (tags.includes("r_siro") && tags.includes("death")) {
//           sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §e${playerName} §7は §r§l白 §r§7です。"}]}`);
//         } else if (tags.includes("r_tairou") && tags.includes("death")) {
//           sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §e${playerName} §7は §8§l大狼 §r§7です。"}]}`);
//         } else {
//           sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §e${playerName} §7は 霊媒できませんでした"}]}`);
//         }

//         sender.runCommandAsync(`playsound conduit.attack`);
//         sender.runCommandAsync(`clear @s wj:reibai 0 1`);

//       } else if (sender.getTags().includes("stolen_reibai")) {
//         sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §e${playerName} §7は §r§l白 §r§7です。"}]}`);
//         sender.runCommandAsync(`playsound conduit.attack`);
//         sender.runCommandAsync(`clear @s wj:reibai 0 1`);

//       } else {
//         sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §7あなたは霊媒ではありません。"}]}`);
//         sender.runCommandAsync(`playsound conduit.short`);
//       }

//     } else {
//       sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§b 霊媒 §7] §7手に §b霊媒の目 §7を持ってください。"}]}`);
//       sender.runCommandAsync(`playsound conduit.short`);
//     }

//   } else if (message.startsWith("!k ")) {
//     event.cancel = true;
//     const playerName = message.split(" ")[1];
//     const players = world.getPlayers();
//     const targetPlayer = players.find(player => player.nameTag === playerName);

//     if (targetPlayer === undefined || !targetPlayer.getTags().includes("sanka")) {
//       sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 狩人 §7] §e${playerName} §7はいません。"}]}`);
//       sender.runCommandAsync(`playsound block.grindstone.use`);
//       return;
//     }

//     const inventory = sender.getComponent("inventory");
//     const slot = inventory.container.getSlot(sender.selectedSlotIndex);

//     if (slot.typeId == "wj:kariudo") {
//       if (sender.getTags().includes("kariudo")) {

//         sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 狩人 §7] §e${playerName} §7にトーテムを渡しました。"}]}`);
//         targetPlayer.runCommandAsync(`scriptevent wj:migawari`);
//         sender.runCommandAsync(`playsound vault.open_shutter`);
//         sender.runCommandAsync(`clear @s wj:kariudo 0 1`);

//       } else if (sender.getTags().includes("stolen_kariudo")) {
//         if (slot.typeId == "wj:kariudo") {
//           sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 狩人 §7] §e${playerName} §7にトーテムを渡しました。"}]}`);
//           sender.runCommandAsync(`playsound vault.open_shutter`);
//           sender.runCommandAsync(`clear @s wj:kariudo 0 1`);
//         }

//       } else {
//         sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 狩人 §7] §7あなたは狩人ではありません。"}]}`);
//         sender.runCommandAsync(`playsound vault.deactivate`);
//       }
//     } else {
//       sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 狩人 §7] §7手に §6狩人の瓶 §7を持ってください。"}]}`);
//       sender.runCommandAsync(`playsound vault.deactivate`);
//     }
//   } else if (message.startsWith("!n ")) {
//     event.cancel = true;
//     const playerName = message.split(" ")[1];
//     const players = world.getPlayers();
//     const targetPlayer = players.find(player => player.nameTag === playerName);

//     if (targetPlayer === undefined || !targetPlayer.getTags().includes("sanka")) {
//       sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 怪盗 §7] §e${playerName} §7はいません。"}]}`);
//       sender.runCommandAsync(`playsound block.grindstone.use`);
//       return;
//     }

//     const roleCount = info_roles.length;
//     if (sender.getTags().includes("kaitou")) {
//       let roleFound = false;
//       for (let i = 0; i < roleCount; i++) {
//         const role = info_roles[i];

//         if (targetPlayer.getTags().includes(role.id)) {
//           if (targetPlayer === sender) {
//             roleFound = true;
//             sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 怪盗 §7] §e${playerName} §7の役職を盗み、 §r§l市民 §r§7になりました。"}]}`);
//             sender.runCommandAsync(`tag @s remove kaitou`);
//             sender.runCommandAsync(`tag @s add stole_kaitou`);
//             sender.runCommandAsync(`tag @s add simin`);
//             sender.runCommandAsync(`playsound trial_spawner.charge_activate`);
//             break;
//           } else {
//             roleFound = true;
//             sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 怪盗 §7] §e${playerName} §7の役職を盗み、 ${role.prop} §r§7になりました。"}]}`);
//             sender.runCommandAsync(`tag @s remove kaitou`);
//             sender.runCommandAsync(`tag @s add stole_kaitou`);
//             sender.runCommandAsync(`tag @s remove siro`);
//             sender.runCommandAsync(`tag @s remove r_siro`);
//             sender.runCommandAsync(`tag @s remove simin_team`);
//             sender.runCommandAsync(`tag @s add ${role.id}`);

//             targetPlayer.runCommandAsync(`tag @s remove ${role.id}`)
//             targetPlayer.runCommandAsync(`tag @s add stolen_${role.id}`);
//             targetPlayer.runCommandAsync(`tag @s remove siro`);
//             targetPlayer.runCommandAsync(`tag @s remove kuro`);
//             targetPlayer.runCommandAsync(`tag @s remove r_siro`);
//             targetPlayer.runCommandAsync(`tag @s remove r_kuro`);
//             targetPlayer.runCommandAsync(`tag @s remove simin_team`);
//             targetPlayer.runCommandAsync(`tag @s remove kyozin_team`);
//             targetPlayer.runCommandAsync(`tag @s remove zinrou_team`);
//             targetPlayer.runCommandAsync(`tag @s remove youko_team`);
//             targetPlayer.runCommandAsync(`tag @s remove zombie_team`);
//             targetPlayer.runCommandAsync(`tag @s add simin`);

//             sender.runCommandAsync(`playsound trial_spawner.charge_activate`);
//             break;
//           }
//         }
//       }
//       if (!roleFound) {
//         sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 怪盗 §7] §e${playerName} §7の役職が見つかりませんでした。"}]}`);
//         sender.runCommandAsync(`playsound trial_spawner.ambient_ominous`);
//       }
//     } else {
//       sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§7[§a 怪盗 §7] §7あなたは怪盗ではありません。"}]}`);
//       sender.runCommandAsync(`playsound trial_spawner.ambient_ominous`);
//     }
//   }
// });

system.runInterval(() => {
  sys.runCommand("execute as @a[hasitem={item=bow,location=slot.weapon.mainhand}] run enchant @s infinity 1");
  sys.runCommand("execute as @a[hasitem={item=shield,location=slot.weapon.mainhand}] run enchant @s unbreaking 1");
});

// Give Items
system.afterEvents.scriptEventReceive.subscribe((ev) => {
  const { sourceEntity, id } = ev;
  switch (id) {
    case ("wj:bow"):
      var item = new ItemStack("minecraft:bow", 1);
      item.lockMode = "inventory";
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7１撃で倒すことのできる弓', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    // Role Items 
    case ("wj:uranai"):
      var item = new ItemStack("wj:uranai", 1);
      item.lockMode = "inventory";
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7１人を選んで占うことができる', '§d占い師アイテム', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:reibai"):
      var item = new ItemStack("wj:reibai", 1);
      item.lockMode = "inventory";
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7１人を選んで霊媒することができる', '§b霊媒者アイテム', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:kariudo"):
      var item = new ItemStack("wj:kariudo", 1);
      item.lockMode = "inventory";
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7１人を選んでトーテムを渡すことができる', '§6狩人アイテム', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:kaitou"):
      var item = new ItemStack("wj:kaitou", 1);
      item.lockMode = "inventory";
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7１人を選んで役職を盗むことができる', '§6怪盗アイテム', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:nise_uranai"):
      var item = new ItemStack("wj:uranai", 1);
      item.lockMode = "inventory";
      item.nameTag = "§7偽§d占いの棒";
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7占うことができない偽アイテム', '§e狂人、狂信者アイテム', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:nise_reibai"):
      var item = new ItemStack("wj:reibai", 1);
      item.lockMode = "inventory";
      item.nameTag = "§7偽§b霊媒の目";
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7霊媒することができない偽アイテム', '§e狂人、狂信者アイテム', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:kogitune_uranai"):
      var item = new ItemStack("wj:uranai", 1);
      item.lockMode = "inventory";
      item.nameTag = "§d子狐の杖";
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7１人を選んで占うことができる', '§d子狐アイテム', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:ookami"):
      var item = new ItemStack("wj:ookami", 1);
      item.lockMode = "inventory";
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7全員を狼にすることができる', '§7翻狼アイテム', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:zombie"):
      var item = new ItemStack("wj:zombie", 1);
      item.lockMode = "inventory";
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7ゾンビと感染者以外をランダムで一人感染させる薬', '§2ゾンビアイテム', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:receiver"):
      var item = new ItemStack("wj:receiver", 1);
      item.lockMode = "inventory";
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7手に持つことで死体の数がわかる', '§3警察官アイテム', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:hakka"):
      var item = new ItemStack("wj:hakka", 1);
      item.lockMode = "inventory";
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7半径３マスにある死体を消すことができる', '§c焼却者アイテム', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    // Ramdom Items 
    case ("wj:touketu"):
      var item = new ItemStack("wj:touketu", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7自分以外の全員を５秒間動けなくさせる', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:shinryu_ken"):
      var item = new ItemStack("wj:shinryu_ken", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7１度のみ１撃で倒すことができる剣', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:gisou"):
      var item = new ItemStack("wj:gisou", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7全員に弓の音を鳴らす', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:tubasa"):
      var item = new ItemStack("minecraft:elytra", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7滑空で飛ぶことができる', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:migawari"):
      var item = new ItemStack("minecraft:totem_of_undying", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7トーテムを持っている間、一度死を免れる', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:kusuri"):
      var item = new ItemStack("wj:kusuri", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7自身についているエフェクト効果をすべて打ち消す', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:uranai_me"):
      var item = new ItemStack("wj:uranai_me", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7ランダムで一人占うことができる', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:sinzitu"):
      var item = new ItemStack("wj:sinzitu", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7半径５マスのランダムな人１人の役を知ることができる', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:bouenkyo"):
      var item = new ItemStack("minecraft:spyglass", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7遠くを見ることができる', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:sensor"):
      var item = new ItemStack("wj:sensor", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7手に持つと半径１０マス以内に人がいるかを感知する', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:ankoku"):
      var item = new ItemStack("wj:ankoku", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7自分以外の全員を１０秒間目を見えなくさせる', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:shield"):
      var item = new ItemStack("minecraft:shield", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7手に持ってしゃがんだとき、正面からの攻撃を無効化する', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:kago"):
      var item = new ItemStack("wj:kago", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7３秒間自身が無敵になる', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:kinomi"):
      var item = new ItemStack("wj:kinomi", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7半径２マスのプレイヤーに透明化を１５秒間与える', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:usagi"):
      var item = new ItemStack("wj:usagi", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7半径２マスのプレイヤーにジャンプ力上昇を４５秒間与える', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:hayabusa"):
      var item = new ItemStack("wj:hayabusa", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7半径２マスのプレイヤーにスピード上昇を３０秒間与える', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:himo"):
      var item = new ItemStack("wj:himo", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7手に持ったとき、一番近くの生きているプレイヤーのほうを向き、動けなくなる', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;

    case ("wj:nazo"):
      var item = new ItemStack("wj:nazo", 1);
      item.setLore([
        '§6*-*-*-*-*-*-*-*-*-*', '§7手に持ったとき、一番近くの生きているプレイヤーの方向にパーティクルを出す', '§6*-*-*-*-*-*-*-*-*-*'
      ]);
      sourceEntity.getComponent('minecraft:inventory').container.addItem(item);
      break;
  }
});

system.runInterval(() => {
  sys.runCommand("kill @e[type=item,name=§d占いの棒]");
  sys.runCommand("kill @e[type=item,name=§b霊媒の目]");
  sys.runCommand("kill @e[type=item,name=§6狩人の瓶]");
  sys.runCommand("kill @e[type=item,name=§7偽§d占いの棒]");
  sys.runCommand("kill @e[type=item,name=§7偽§b霊媒の目]");
  sys.runCommand("kill @e[type=item,name=§d子狐の杖]");
  sys.runCommand("kill @e[type=item,name=§7骨の杖]");
  sys.runCommand("kill @e[type=item,name=§2感染薬]");
  sys.runCommand("kill @e[type=item,name=§8レシーバー]");
  sys.runCommand("kill @e[type=item,name=§c発火装置]");
});
