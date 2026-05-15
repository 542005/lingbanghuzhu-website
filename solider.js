/**
 * 邻帮互助平台 - 轮播图功能脚本
 * 文件名：slider.js
 * 功能：首页轮播图的自动轮播、手动切换、指示器控制
 */

// 等待页面完全加载
document.addEventListener('DOMContentLoaded', function() {
    console.log('轮播图脚本加载成功');
    
    // 获取轮播图相关元素
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // 如果没有找到轮播图元素，则退出
    if (!sliderContainer || slides.length === 0) {
        console.warn('未找到轮播图元素，slider.js 停止执行');
        return;
    }
    
    // 当前显示的幻灯片索引
    let currentSlideIndex = 0;
    // 自动轮播计时器
    let autoplayTimer = null;
    // 轮播间隔时间（毫秒）
    const autoplayInterval = 5000;
    // 是否允许自动轮播
    let autoplayEnabled = true;
    
    /**
     * 显示指定索引的幻灯片
     * @param {number} index - 要显示的幻灯片索引
     */
    function showSlide(index) {
        // 确保索引在有效范围内
        if (index < 0) {
            currentSlideIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentSlideIndex = 0;
        } else {
            currentSlideIndex = index;
        }
        
        // 隐藏所有幻灯片
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.transform = 'translateX(100%)';
        });
        
        // 显示当前幻灯片
        const currentSlide = slides[currentSlideIndex];
        currentSlide.classList.add('active');
        
        // 添加淡入和滑动动画
        setTimeout(() => {
            currentSlide.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            currentSlide.style.opacity = '1';
            currentSlide.style.transform = 'translateX(0)';
        }, 50);
        
        // 更新指示器（如果存在）
        updateIndicators();
    }
    
    /**
     * 显示下一张幻灯片
     */
    function nextSlide() {
        showSlide(currentSlideIndex + 1);
        // 重置自动轮播计时器
        resetAutoplay();
    }
    
    /**
     * 显示上一张幻灯片
     */
    function prevSlide() {
        showSlide(currentSlideIndex - 1);
        // 重置自动轮播计时器
        resetAutoplay();
    }
    
    /**
     * 创建轮播指示器
     */
    function createIndicators() {
        // 检查是否已有指示器容器
        let indicatorsContainer = document.querySelector('.slider-indicators');
        
        if (!indicatorsContainer) {
            // 创建指示器容器
            indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'slider-indicators';
            indicatorsContainer.style.cssText = `
                position: absolute;
                bottom: 20px;
                left: 0;
                right: 0;
                display: flex;
                justify-content: center;
                gap: 10px;
                z-index: 10;
            `;
            
            // 创建每个幻灯片的指示点
            for (let i = 0; i < slides.length; i++) {
                const indicator = document.createElement('button');
                indicator.className = 'slider-indicator';
                indicator.setAttribute('aria-label', `跳转到幻灯片 ${i + 1}`);
                indicator.setAttribute('data-index', i);
                
                indicator.style.cssText = `
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: none;
                    background: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    padding: 0;
                    transition: all 0.3s ease;
                `;
                
                // 点击指示点跳转到对应幻灯片
                indicator.addEventListener('click', function() {
                    const targetIndex = parseInt(this.getAttribute('data-index'));
                    showSlide(targetIndex);
                    resetAutoplay();
                });
                
                // 鼠标悬停效果
                indicator.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.2)';
                });
                
                indicator.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('active')) {
                        this.style.transform = 'scale(1)';
                    }
                });
                
                indicatorsContainer.appendChild(indicator);
            }
            
            // 将指示器容器添加到轮播图中
            sliderContainer.appendChild(indicatorsContainer);
        }
    }
    
    /**
     * 更新指示器状态
     */
    function updateIndicators() {
        const indicators = document.querySelectorAll('.slider-indicator');
        if (indicators.length > 0) {
            indicators.forEach((indicator, index) => {
                if (index === currentSlideIndex) {
                    // 当前活动指示点
                    indicator.style.background = 'rgba(255, 255, 255, 1)';
                    indicator.style.transform = 'scale(1.2)';
                    indicator.classList.add('active');
                } else {
                    // 非活动指示点
                    indicator.style.background = 'rgba(255, 255, 255, 0.5)';
                    indicator.style.transform = 'scale(1)';
                    indicator.classList.remove('active');
                }
            });
        }
    }
    
    /**
     * 开始自动轮播
     */
    function startAutoplay() {
        if (autoplayEnabled && slides.length > 1) {
            clearInterval(autoplayTimer);
            autoplayTimer = setInterval(nextSlide, autoplayInterval);
        }
    }
    
    /**
     * 暂停自动轮播
     */
    function pauseAutoplay() {
        clearInterval(autoplayTimer);
    }
    
    /**
     * 重置自动轮播（用户交互后重新计时）
     */
    function resetAutoplay() {
        if (autoplayEnabled) {
            pauseAutoplay();
            startAutoplay();
        }
    }
    
    /**
     * 初始化轮播图
     */
    function initSlider() {
        console.log(`初始化轮播图，共发现 ${slides.length} 张幻灯片`);
        
        // 设置轮播图容器的相对定位
        sliderContainer.style.position = 'relative';
        sliderContainer.style.overflow = 'hidden';
        
        // 初始化幻灯片样式
        slides.forEach((slide, index) => {
            slide.style.position = 'absolute';
            slide.style.top = '0';
            slide.style.left = '0';
            slide.style.width = '100%';
            slide.style.height = '100%';
            slide.style.opacity = '0';
            slide.style.transform = 'translateX(100%)';
            slide.style.transition = 'none';
        });
        
        // 创建轮播指示器
        createIndicators();
        
        // 添加上一页/下一页按钮事件监听
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
            prevBtn.style.cssText = `
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.3);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                z-index: 10;
                transition: all 0.3s ease;
            `;
            
            // 鼠标悬停效果
            prevBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(0, 0, 0, 0.6)';
                this.style.transform = 'translateY(-50%) scale(1.1)';
            });
            
            prevBtn.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(0, 0, 0, 0.3)';
                this.style.transform = 'translateY(-50%) scale(1)';
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
            nextBtn.style.cssText = `
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.3);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                z-index: 10;
                transition: all 0.3s ease;
            `;
            
            // 鼠标悬停效果
            nextBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(0, 0, 0, 0.6)';
                this.style.transform = 'translateY(-50%) scale(1.1)';
            });
            
            nextBtn.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(0, 0, 0, 0.3)';
                this.style.transform = 'translateY(-50%) scale(1)';
            });
        }
        
        // 鼠标悬停在轮播图上时暂停自动轮播
        sliderContainer.addEventListener('mouseenter', pauseAutoplay);
        sliderContainer.addEventListener('mouseleave', startAutoplay);
        
        // 触摸滑动支持（移动端）
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        /**
         * 处理触摸滑动
         */
        function handleSwipe() {
            const swipeThreshold = 50; // 滑动阈值（像素）
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // 向左滑动，下一张
                    nextSlide();
                } else {
                    // 向右滑动，上一张
                    prevSlide();
                }
            }
        }
        
        // 键盘导航支持
        document.addEventListener('keydown', function(e) {
            if (document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA') {
                return; // 如果焦点在输入框中，不处理
            }
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    showSlide(0);
                    resetAutoplay();
                    break;
                case 'End':
                    e.preventDefault();
                    showSlide(slides.length - 1);
                    resetAutoplay();
                    break;
            }
        });
        
        // 显示第一张幻灯片
        showSlide(0);
        
        // 开始自动轮播
        startAutoplay();
        
        // 添加窗口失去焦点时暂停轮播
        window.addEventListener('blur', pauseAutoplay);
        window.addEventListener('focus', startAutoplay);
        
        console.log('轮播图初始化完成');
    }
    
    // 执行初始化
    initSlider();
    
    // 提供公共API（可选，方便外部控制）
    window.sliderAPI = {
        nextSlide: nextSlide,
        prevSlide: prevSlide,
        goToSlide: showSlide,
        pause: pauseAutoplay,
        play: startAutoplay,
        getCurrentSlide: () => currentSlideIndex + 1,
        getTotalSlides: () => slides.length
    };
    
    // 调试信息
    console.log('轮播图API已暴露为 window.sliderAPI');
});