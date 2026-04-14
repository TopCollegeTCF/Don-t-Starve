//-------------------------------------------------------------
//  Global Tests @Gabryelf (Valeev Sergey)       01.03.2026
//-------------------------------------------------------------

function helloQA() {
    console.log("✅ Integration & QA ready");
    
    // Проверка всех модулей
    const modules = [
        { name: "Core", check: () => typeof helloCore === 'function' },
        { name: "State", check: () => typeof helloState === 'function' },
        { name: "Sound", check: () => typeof helloSound === 'function' },
        { name: "AI", check: () => typeof helloAI === 'function' },
        { name: "UI", check: () => typeof helloUI === 'function' }
    ];
    
    let allLoaded = true;
    modules.forEach(module => {
        if(module.check()) {
            console.log(`✅ ${module.name} module loaded`);
        } else {
            console.error(`❌ ${module.name} module missing`);
            allLoaded = false;
        }
    });
    
    if(allLoaded) {
        console.log("🎉 All systems operational!");
    }
    
    return { allLoaded, modules };
}

helloQA();
