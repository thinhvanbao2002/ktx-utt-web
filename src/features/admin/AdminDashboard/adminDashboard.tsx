import { useCallback, useEffect, useState, useRef, useLayoutEffect } from 'react'
import './adminDashbroad.css'
import { adminDashboardServices } from './adminDashboardApis'
import { formatPrice } from 'common/utils'
import { useAuth } from 'hooks/useAuth'
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer'
import StudentRegisterBarChart from './components/StudentRegisterBarChart'
import Marquee from 'react-fast-marquee'

// Hook để thêm hiệu ứng slide-in khi scroll
function useSlideInOnScroll() {
  const ref = useRef<HTMLDivElement | null>(null)

  // Đếm số lượng block gallery để làm dependency
  const getBlockCount = () => ref.current?.querySelectorAll('.gallery-block').length || 0

  useLayoutEffect(() => {
    if (!ref.current) return
    const blocks = ref.current.querySelectorAll('.gallery-block')
    if (!blocks.length) return

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.2 }
    )

    blocks.forEach((block) => observer.observe(block))
    return () => {
      blocks.forEach((block) => observer.unobserve(block))
      observer.disconnect()
    }
  }, [getBlockCount()])

  return ref
}

function AdminDashboardScreen() {
  const [adminDashboardData, setAdminDashboardData] = useState<any>({})
  const { user } = useAuth()
  console.log('🚀 ~ AdminDashboardScreen ~ user:', user)

  const getAdminDashboarData = useCallback(async () => {
    try {
      const res = await adminDashboardServices.post()
      if (res) {
        setAdminDashboardData({ ...res?.data })
      }
    } catch (error) {
      console.log('🚀 ~ getAdminDashboarData ~ error:', error)
    }
  }, [])

  useEffect(() => {
    getAdminDashboarData()
  }, [])

  const galleryRef = useSlideInOnScroll()

  return (
    <>
      {user?.role === 'admin' && (
        <>
          <div className='w-full flex items-center justify-between text-custom-sm text-while'>
            <div className='w-[20%] h-[100px] shadow-block rounded-md bg-baseBackground flex items-center justify-center  '>
              <div className='text-center'>
                <div>Sinh viên</div>
                <div className='font-semibold text-custom-xl'>{formatPrice(adminDashboardData.student)}</div>
              </div>
            </div>
            <div className='w-[20%] h-[100px] shadow-block rounded-md bg-baseBackground flex items-center justify-center  '>
              <div className='text-center'>
                <div>Phòng</div>
                <div className='font-semibold text-custom-xl'>{formatPrice(adminDashboardData.room)}</div>
              </div>
            </div>
            <div className='w-[20%] h-[100px] shadow-block rounded-md bg-baseBackground flex items-center justify-center  '>
              <div className='text-center'>
                <div>Yêu cầu thuê phòng</div>
                <div className='font-semibold text-custom-xl'>{formatPrice(adminDashboardData.countCategories)}</div>
              </div>
            </div>
            <div className='w-[20%] h-[100px] shadow-block rounded-md bg-baseBackground flex items-center justify-center  '>
              <div className='text-center'>
                <div>Yêu cầu hỗ trợ</div>
                <div className='font-semibold text-custom-xl'>{formatPrice(adminDashboardData.claim)}</div>
              </div>
            </div>
          </div>
          <StudentRegisterBarChart />
        </>
      )}
      {user?.role === 'student' && (
        <div className='student-dashboard'>
          {/* Slide chữ chạy */}
          <div className='marquee'>
            <Marquee>Chào mừng bạn đến với Ký túc xá UTT! Nơi an toàn, tiện nghi và thân thiện cho sinh viên.</Marquee>
          </div>

          {/* Dịch vụ nổi bật */}
          <section className='services-section'>
            <div className='intro-features'>
              <div className='intro-feature-card'>
                <img src='/icons/security.svg' alt='An ninh' className='intro-icon' />
                <h3>An ninh 24/7</h3>
                <p>Đảm bảo an toàn tuyệt đối cho sinh viên.</p>
              </div>
              <div className='intro-feature-card'>
                <img src='/icons/wifi.svg' alt='Wifi' className='intro-icon' />
                <h3>Wifi tốc độ cao</h3>
                <p>Internet phủ sóng toàn bộ ký túc xá.</p>
              </div>
              <div className='intro-feature-card'>
                <img src='/icons/canteen.svg' alt='Nhà ăn' className='intro-icon' />
                <h3>Nhà ăn hiện đại</h3>
                <p>Thực đơn đa dạng, đảm bảo dinh dưỡng.</p>
              </div>
              <div className='intro-feature-card'>
                <img src='/icons/laundry.svg' alt='Giặt là' className='intro-icon' />
                <h3>Dịch vụ giặt là</h3>
                <p>Tiện lợi, nhanh chóng, giá cả hợp lý.</p>
              </div>
            </div>
          </section>

          {/* Ảnh 360 */}
          <div className='photo-sphere-rounded' style={{ marginTop: 32 }}>
            <ReactPhotoSphereViewer
              src='/panoUTT.jpg'
              height='800px'
              width='100%'
              mousewheel={false}
              navbar={['fullscreen']}
            />
          </div>

          <section className='intro-section'>
            <h2>Giới thiệu về Ký túc xá UTT</h2>
            <div className='intro-features'>
              <div className='intro-feature-card'>
                <img src='/icons/location.svg' alt='Vị trí' className='intro-icon' />
                <h3>Vị trí thuận tiện</h3>
                <p>Nằm ngay trong khuôn viên trường, thuận tiện cho việc học tập và di chuyển.</p>
              </div>
              <div className='intro-feature-card'>
                <img src='/icons/modern.svg' alt='Hiện đại' className='intro-icon' />
                <h3>Môi trường hiện đại</h3>
                <p>Cơ sở vật chất mới, phòng ở sạch sẽ, đầy đủ tiện nghi.</p>
              </div>
              <div className='intro-feature-card'>
                <img src='/icons/security.svg' alt='An ninh' className='intro-icon' />
                <h3>An ninh đảm bảo</h3>
                <p>Bảo vệ 24/7, hệ thống camera giám sát toàn khu ký túc xá.</p>
              </div>
              <div className='intro-feature-card'>
                <img src='/icons/support.svg' alt='Hỗ trợ' className='intro-icon' />
                <h3>Hỗ trợ sinh viên</h3>
                <p>Đội ngũ quản lý thân thiện, hỗ trợ sinh viên mọi lúc.</p>
              </div>
            </div>
          </section>

          <section className='gallery-section' ref={galleryRef}>
            <div className='gallery-block left-slide'>
              <img
                src='https://utt.edu.vn/uploads/images/news/603b032d793f426b09e8e63aa0c768c4.png'
                alt='Ký túc xá 1'
              />
              <div className='gallery-caption'>
                <h3>Không gian học tập hiện đại</h3>
                <p>Phòng học, phòng sinh hoạt chung rộng rãi, đầy đủ tiện nghi.</p>
              </div>
            </div>
            <div className='gallery-block right-slide'>
              <img
                src='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSEhMWFhUWFx4YGBgYFxgaGRcYGB8YGRgZGBgaHSggGBolGxcXITEiJSkrLi4uFyAzODMtNygtLisBCgoKDg0OGxAQGy0lICUwLS8tLTUtLy0tLS0uLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMIBBAMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAFAQIDBAYAB//EAEcQAAIBAwIEBAQCBwYFAQgDAAECEQADIRIxBAVBURMiYXEGMoGRQqEUI2KxwdHwFTNScuHxQ1OCorLCY3ODkqOz0tMHFiT/xAAaAQADAQEBAQAAAAAAAAAAAAAAAQIDBAUG/8QAMxEAAgIABAIHBwQDAQAAAAAAAAECEQMSITEEQRMyUWFxkfAFIoGhscHRFEJS4TNykiP/2gAMAwEAAhEDEQA/ANLXRTopIr6Y+WGkUopSK4CgZwpwrq4UhDqcKVRSxU2UKtPWmqtSBahlWOApRSqKkC1DYyOlmpNFNZaVgNmkNcRSUwOptLSUwGtUZp5ppqkAxhUZFTEVGwq0Q0RGkNPK0hFWIjK0mmnxXRTAjikIqWK4igCHTSaamik00AQxXRUumkK0AMiup+muoAmilp8UkVNgNropQKUClYCAU4LSinCk2FHKKkC0gFOFQ2McBTwKaKeoqGND0FSUwU4GoZY6kK0op8VIEZWoilXAtRvboUgoqMtNIqZhTIrRMRCRTSKnK0wirTAiNNIqUimxVWBGVppWpCKSKdk0REUkVLpppFVZNDQKSKkApwWiwohK0mmptNJpozBRFppNNTBa7RRYUQ6aSpyldTzALFdFTaK7RWeYqiILT1SnhacBSbChgt0oSplWl8OozDojCU9bdOVaeBUuQ6EFuu0VIBSgVNjIgtLFTaKXw6WYCIU8Gl8OuKUrQDwaRjSAVHfvogJZgIE+sbbb71LaWrKjFydRVsay0mmmNx9nPnBiNpO41DbeQcd6i4jmVtNEz55g4gQVUgmcGW/KN6XTwS3No8JjyaSg9dtO6/pqTkVEwqi3OJBKpqOnVAORgldQIEHyvIBJGnrSpcvMjRMi4QYWCFzGnUIOQM5walcXDlqbv2bjxVzqPi/xen15FsrXFaGXXune4tswZBdSfOOy7lCfrHrTRdswNbBir6lADPpEAFQzgTJk/X0qHx0V/bo1XsuVda/BX6+nx0d+5eRYlhkx9YnPbEfcVA/G2+hn29NU5MARobc9PUULNyyFgeIfLoJJA1AgBhnVAOldtoERSPxqyStpQT1JYndj0I/xEexiueXtJ9q+bO2PsjCr9z8kvLcIcVxoWQBLAAjsQSgBEdCXj3BpLPEM76VXBHlaCRsrCdoPm2/1oZc4+4ewgQIUCB2BiarXuIuH5nY+7Gspe0pZrTddmxtD2XhqFOKvXW2+zWttOzbUKi5cEFoWQsyQsEaWYQx2gsv0FWbnMbI3uD6Sf3Cso15f8Qn0yfypXtttofH7DR9yIqYcdjx6sb8bf4DH9n8PiNZ2lXZS7PHsNDc55aGwY/QD95qtd+If8Nv7tP5AUI/RXx5Rnuy49wCTT14F+pUHpGpvvgUPieMl3eRC4PgId/mWbnPbp20j2H85qtc5peO9xvoY/dFOtcAZALE52CgT6TJpRwSnBLfVwP8AxAqHHiJdafzNFLhYdSHyRDLnJ1H711XA+glZXBzJkg+7EmurLoJ/yQ/1L/gbEW6cLdWPDrhbr6HOfLUV/DpRaq0EpwSlnHRXFul0VZCU9bVQ5jylPTTQ2dPXfFX2siKo8TdsocsFMbDc++mawxcatTpwMHPpVnWrgImR6+kf7Un6da/5in2IPcdPY/Y9qiPOLIEeZvYfzihNy9Zx5HMLoy+ny+fGB2uEb9BXM+LypapnfhezlNtzjJLlt96Clzm6AkBWYKYYiBB1m2N+7K4H+X1FMXniEiBAnJYwR/dyAADLfrBj0Jmh36cBBW2kiTJ1MSSS0mTnzEkSMTimHmjjAKr6BVGwgdJwBH0rJ8ZLt+R2R9m4K3h5yr6X65cwjf5hfm4q28qSBj5YZACx1QQUYt+GNJp3Em+yYPhklh59I0qySp3GQ0LP1zQe5xl1hlnYf9RH5VXMz/qo9epqOmxHsmy1w+DFLqJruvlXN+WnmGbfCPcYjWrAGWGpnR5LFVI2SFMQNyB2oi/KGZi2ojUVYwBIZIiCfw42PrWD5nz/AIq0wt2X0JiQqrJYiSSSCZ9jGKGXudcQ95tXEXSoa4I1tAADacAx/tXTCDyW62b58jkxZvpKTpJpbLnr9vholokj01uR2UGq4VWM6ncLuIJOw/l0iq1zmXLbanVxFkhZBg+JljqIJEmSVn6V5TZ4S4bV27BI0gEwd9aGCe8Cd5qjP6lv/eJ/4vWqwkrprdLbtoyeJKdZm3o3q3yv18T1Lm3xLw72Z4VySzwW0ssBYJOQD1A+9AzxgaZfUeudR9J+35UC5LPgLH/Mb9yUdv8AGG1a1E/iUQTAzMVw4uE8XElcnSdHfg4scDDjliraslUEiQr/AFUr9tUYp4tNEwBnYsPv5dVBU5/LlRoBGrqCfICW2J7dRTuF5sblt7gfCTO8YUtJ8obp0qf02HFa2V+sxZbUgyOHb/EoPoGb9+ml/RQAdTn3Glf36qy/L+cXrxfEhbbMCstLLsBLEH+NWLN+81q9CMjADSWgGdag/hEYJ+9bLBgv2owfEYst5MPhLQ66pxlmb1wFxPtS2haDYQTDZ0CdjOWztWb5ZwHGOL0q51WiFjUw1SsRBOd9qt8j+GeJS8ty4sABx5gVPmRl/EB1bvVLS1oRJ2k27DC8xtmFUgk9A4/cJofd5/ZkAESdgFdpnbYU/lHw5fF1Ha9KqRI1qQZUj5UYj126VDw3wGQTNz2IW4T7/wB2APuarnqyC1xPHaMuVXJj5REY2ZpP0FUuL52qqjs5i5MESYCmGIAiY7SK0/F/Cdm8Q14MxBMQdIAOTs3eP5U278LWCoTwwQoYIGYHTqOrEo07dazhde8XNq/d7jNJzRSviAFgL625YGfNBmCTG9LyXmlx7zLACrc0+UKP8QzJncdP41rm5JaAIW2igtqIGoCRsYUjpUbcELc+HbUls4DAb5lizGd9hU4klGLdEq7KHNOX3WuudOqTvgAmBJEnaZrqG3+HvMxb9GS5JnUEJGegLA9Ppv7nq8ufTSk5Ln3f2dkOLcIqNbHpOnJ/roKcEodx/HvbukCCMYI9B2pbXOx+JPsf4Gvp9T5qkEdFOCUnDcbbfYx74/0qa+4UTI+4rNyotYdkdwQrHspP2FZ3g+areLKlxiVEmdajPvE0Y4rmVprFxtag6CCCRIJXY/ce8isb8Ika70sDCoJ6bvP7qTyyhKV6o1w80cRQrR2aNgACT0rN8dzJHcEkLMKBuT7TGc9jWkuMCpgg4NZjgfhO4gXURIuG5A+kLnf5a5HUt1Z6cJOLtOiunMrZyDMeoj6+Xb61G/NUAzA36kHEzjV6H7VaPwGpYMbjgxGNIByT3nYkVbb4KtM+t9RMMMNGG1zjT+2aEop6JeQ3iTa1k/ME8TzRQzJgtnEDZYnJU91ptzmraFdFdlZQRHbOIkTscCtJ/wD1nhwxuMBqO5b136jsKF805ibQTh+HZFyIYH5EwrBfMemc9jTc8uxm6rUF3+MeWAC6lOxO46nMxGKj4LmN03bQZDDAkwMDDY1CI2HTrUnEcnRV1vcyZyIYz32P+I+uKg5PxZRi1vUwAjqcZE4zgRj0rJ4s4u3qiRl3jiLpIUh2UqZCkSMArO3lnfqao3b5YwqiTq8xBEjLfKcYk5I2xiqHxFem8dMZJj/KYgmNifTtmr/LQmka20ggrn1wcjqKVvL4hdy17R1i9cgoWkQCflIBERuDvQvjY0PH/NXGMeV8YEUXs8n127uh7YwCWFzUmHGSRJXIjPpQLUfBPU+KM7/hb7114EMtu71X2Id8+yX3NJ8M8KblpEGCXbpOwU7Ejt3rQcbyizfTwLjGDBiQMqR2JjLCgHwrxRS3aYTPiN0jeBANTc85rpvi5EMH1QZGv1MDOwzM5HrHBjSmsWSg61Z1Sro4f6o0XK/gjhLUlVnfLNOCGU4CDBE/1uQPKuGtgqltFncKCAQQRsGzsayVnnuuRqK42DMIC46HaDHftmqd/mR0aJ1lo80sSojM9TvMY260+nlLQy0T0PQrfAWVkeUCM4t7bDdTOJ6079K4VJ/XIvUgXAsCeykQJIFeccHzFwCbgBIzBVegDHfYROOlFV+Irapc0k+RNZCldtSDoe7VeHiZ20FmwTmPDkHS2vGYD3MfYz7Uy3zK0CNFq57iyyj7sBWG4b4v8XWFQnQjXDNzosT0PeoeV/FTXbyW/CA1NE6iY/7RW1LUdOrN6/Oz0sXT7m0v73qK/wA5cbWljubwz9FU1geG+KHd1UW41MoypEajG+uqV34k4rWRpEAnZckAwYLE5iqyoR6K/NbhAjwgeoJuEdIggCetQPzO8Zm4gxjTaJg4/wAVzIiayXMLnFlUNkO5JGoKqmNQXT0xLGKZxnDcwsra8VdLlizKzIRoQidWhoA6Eb5qIuMtipRcdzTXuMu7HiGn9m3aH0/FmnMXYsuu6QxJwykgDMABdhHv61lOa/pV8OfD0OwR0hwNYumQZkaRBG/eqHEuBx58S5cW3qjysRuowYkhTqgwNjSxFcHp9xczQX00sQHaATADJjJ32knfGMx0rqp/p5k+Dd8JJwus9cyCckbbztXV5eq09fQehoOK+KEcu7wrDBWeoMQOpwN43mpU5tabZge++B6zWD4eFUO/ne4cYwTjr0H+sxirFl7ssVBXygzsSBgkHtqH7tpr2ljzrQ4+gg2a678R2R5UBnvp6bSB1zA+tDuZ8ahtyrtvOVGCQJiDsf41mrHDtrYiQ+rdiFmSYyxEttEZyKKcFyV7gbVcAH1OqAR06j+IrOU3N038DSMFFaEXD/E5kJAIaVaQcwQRBGZz9gBV3kF27ddmtjTaLBc5w059wobJrP8AGcp8G6Al1bhgliuyxAMkGB84G/Wjnw9ze5ZYkBAjkE56riCzEZgzEGQPQ1jOFGkGm7DXB3hZVnd9TxqVZggEDJECdhttNLZ+JnbzMzBRM9JA0k7EAGHWMCe43otx/A2uKtB4AJzMdSCPMOsTt3FY/wCKbL8PaW3qJtnBJKhoYaSPaIJgetTHNHRFvcJcZ8RlHC6yynKuHlTMRIZiQfQiqXE/EDBtBtk4YyVQqdIJwYOYX8xVPg1N+8LLL5LYCbiSRIVpJBwoUf1NbfhORcOtsI9y23mJ3jzEaTADgbHYd63U3YqMpxHO3DuoSNOqSDE6X0dF6kz9Krcx+ILqC23hyXUESx8pKoY/74rb/wBmcDkk2vU6z1JYz5+rZ+lK/A8AYBayYGPOpgQO52gCmpO9SmlSowPxBzaVnRJU6dRJkN0I0kgRHfPbFTWuBa8Df1C1aAOkSS0Z0wQJMSok5P3qx8ZXuE1KiEMckBdJBYzvHv8A70J4dzcvLYLSIBaCcAAMVWPWe+etZymyeZDx9tXvf3jlmiPE/DkDP2J/2qS45ZiXdCAjQBgAopglQd8CZ3qnzwC3xLBThSAPYRHrS8VbR0Ryct5YB233B7kxP88SpPKr5oekZVXMs8PwjyChgfigmCo74O8jp0qzw9vUHC99Uk+WAAInuJ2zuPrR5VxQCm0+oqS0wzCTnSJBx06GZNQIGuMS7QNROxgTpn8gPtUydtpsSSWwQ5dxjLEQZBYQZ1bMdpHTPWKXnvGi4FkeYAjABMjue8nudqtcu4OwPDOoldTSYHYYycjYZqbnfD8IbLsqsCu0hBOwxDnv/wB3WsY4aztlyg0lfNGU4bmrs2mPZd+8/SJ+321XIrVoqr3HCMGYskgG5OVYZAAhiu8yD3rHcu4cve/VuAwE+ZkT0IEsAcHb1NHuP5fcWyQXHlOqJTtAMqSYAiM9+1bygiEFhyVbhbQ66SIXUySJChczkgLRPlvwoyq6lwSyFZwcarbLkEzhPzrH8m5xdsjuNOAOnT7k4PcCDIkVueTfG6so2JgSCxGTOwCsQAQZk+01otENMbwnwg668jzIy7XBhv8A4e9XeG+FQro6jTpKmFDx5SDHmQdvzojb+IGO62hiR+scmegI8IQKZZ57cJAItRIE6rpP/wBsVSVWxuVpIEcN8GhWVgW8ugRoGdBLTJuD930NS3Pg9SZhuvReu/8Axe9EDzy53sj6XD/Km3ed3Jw9sbf8Jz7/APFHWaeoifhOTi2MAzKbtH93pI2J6qKS7wAAclfmuIwGrUASQGiVkAiZyfyAqnc528R4i6pyRaMR2jxZ/Oof7YZp1POnIi0Fg7T85nfapUK2G5N7l4coWFlFlVRI1EiEAA2QdhsB12qjxvILMm44RYOqS90DoMkOojAwf41XPPWP/Gb6Jb/iDSNzF3IUXbnmAERYgzEzNs4PXpTd06EWP7Ls3PMWtPEKCFutAUAAStzEbRXVVezxDMxtvKyMs4BJgSYUgRPakrxOnl/NeS/Brk8DK8mu+UKEwgJY+QPBJJaDJYAT3Iwau82vI+i0IW4oIOoHzSysDnC9cYBmhqG1bPiG6UuSCo0kkEH2xtE52qHiOJsso8R9BBkaUJEGCYBxpkbRtivbgnuc7cSzzvjCWCLIIEEgr8vZSFGTAoRxvG3CRb1wsZHyjy94AmrvLOaWVJI03ASJlfvVDmBFy6zKoAJwI6GcYptNLUXwIbxdLZIMSv5EoY99qO8n4c8RwouahbFtvDJXGqFVgSZ+bIE779hUfGlQnDq1vPhtqgRqwQpmf2N/SmWeYeFZ0geU3AymT8wC5KdenXYUJpwp7glTNdwfPms2yjINXUREjvLHynb/AF2rLc45gbqElgS8mVEAaNxvIAEY9ZqtxV1iEtuf1jTcuE4MfiB0/wCXp6RUPHccgYpbH6tVYLA75Y7Tk49h9Kyy0aNk/wAP3mV9bEyTOskgKTknAxg/lWiHHcQGWGDIdGVuMY1kDaOgk5j5aE8XdCXW0AKNC4gBXIGBHUMFnbp7UTfiLNy0t60VVwApQHodsTvJ9sSKak1sFIoH4kvjVv5VLQXbMM6/+ifrUvFc/vq6qMyBMu2PKrfxrQcntcJdt673hAnDayo74nVB3JqXnnD8J4TeG1kvsIYSNgNmPpVZnVjaXYecXb7PfLsZKx3/AKA/nWg+H+RsbA43WAA7Lp0tqzBB1TGxqjxXAousgrBWV0mZIw0emQc5wOlbP4fFk8HZUuMqGK62+YAZ0hwJrJPNIlI87+Jh+vfP4t/ZVj+vWoeDTxAVE6oJG8fKTmPUD86tfEqTecjM3I/Je9Q8nXzZkEoeneRt13/OplJ9Gq7DSS/9X4kBYm1rBkyAe07SPX/WiapauWhqZo1CTgHABAwNqE2so+Mah75JIHvVngLVo29L6gC+f8wA7CaqK1+IoaX4M0vJLNpbOkEkamiRJiASf9aB874vW8Li2oYA43IzjoJMeuavLxIQpZQnQFIkjzADJg9MAmf2eu1AFBLuozqM+8gGPp5e+R60oxtuXewnJtIitNBzBkESYjYQe2Iojw/MyqhSBkEe0j1Gc569qG3REehI/dj3/lU3E2hpUqDkEifQkRnrAI+gqkrepGxZ4R3MgQJVsR0VWMz23+tUreHkCO/v3/f9q1/wPwFq+TrB1AEHzMJDgrOxzBIolz74GVdJsr7+aSSY/Z6Z+gquQUAuS3rxYpr8ugkYGCNskZP867gL/FePaV7xI8S2GEIJDOAQYEjGMVqPhr4YIaboIAkAgjrqB6HsPv1ozb+ErCsGC5UgjzLupkf8LvSw3K22XplSPNm4/iTcVTdMahgBcjVpgkCdqh4/jOIFxx4zgB2AE7AEgfur0Z/g6yW1wZmcMg6z/wAim3/g7h2YsQ0kknzIcnfe0a1zakmG4rxTw6P4twMdMkMcysmfrU/K0bwuIBu3D+r+YkhhOn5Z9q2134YslAnmAERBt9AR/wAr17dKgHw5btq4BY+JCmXXYkDEWxH51nFST3LnJOq7Dzjh1fw2bxbhJtuTLt5dJSCO3zHqdunWd7d03LCrc0k2Vku8LJ1rLasE+sTMRmK3Vr4UtAaZaNLL81v8UTP6oTsN5+tR8T8IWX0li3lXSPNb2yf+T+0aq2QXOWcbwvCobT3dbTqJJfcxIATYAjY53rqks2LltQiXGVRsNdvE5P8AwZ3Jrq818Lj/AMr+NfLKXmXpf2ef+Mlu80KWITVEp8xI7nBJxEE747T8dy0X2RIWw5WWAXVJlYACwsbdZz2ij/EK0BsXZIBltB6QSZkgQYBBJPvWD41nTWisoGuTmSNJME9JIjH9HrwsR4m25m4lv9B05SxcVWGNUwSs6iCekR7GahXi/DJlSSYIgiPTP/UKZwKOYVo1fMrOxUnc4RSCwmSDIGN8GjNnhdXmum6ABAIYANiPKiYEHeZ6aiZrWWIo7j1YD4rjyxGkHyiAJmSM9OnoKn5WFuAeKrKisZYIxGQCQSBAMDr9qtcysWf0pVGAqENA0SfMMaI3kGR0x6UUs2LIxbe7M7BwQ0dG1SZO2CRiOlTn50GVgTmF9DxN5lJ0hQiE5xgyT2gED0oOL3mxsQf51Z4yVLW9QMThCCAfpjb/AFzVOzbMFsxGDBgwNp9p+1XehPMsnj2M6juoM5mViNv2dX3qTlXHvbV9J3GqO8HOJk1UuqwCuIhiQDgjyQCCBscjBjcRM1IE8kgpIBlS6hhjqpMmewnb7i7gZdsfEl5ANJgDoCQPvP8AWKlf4nvvE3GAjIDGPWf5TWdS6vQGfU4+1WfHwBAgfme9W3pQgu/O5AVmGmR6mMg774Peh/8AaTIxKNGAMdQI67xgfaqLle2/9E1NwfCtdbRbUsx6KOnf29ahKMdQDHG3C5Zhvrn/ALbdR8FxIB3BIRp2g9zP1/KrH9nXrfhq1shjcmAVYlRonYnpVHknBwzG4rDBEMpA6ateoCNwB3JrJxVeB0aOV9rZJat67bogd2LKxCKWaPMZUA+bqfar6/Dd4cKryoY3QwtSS5QjSDA6z0nofau5ao8Zhb7rsdB0JI6Z26bxAEVc4h2e+vEXVYBrmnQcwBnSC28do69zUdI47bbkt6Lw+7BvMf7wAjpEfLsSv7t/rVWwIbUonYx3xBP5UQ+IbY8SRKg9CCCpkiNtjEz+1VNuHaFcDfAiInr+U0YcnRm0UuMb9We+omM4kn+f5VMUJCgHI9Tj84ic/wBGpeOtarThcnXiPcxjpUbk2xpYAE9p/ccitbotrtCHwzxpt3JkriMMVHQ9PSa2vD/EWoH9axgT/ezEEZyK894IQe4g/wDiYqH4bsMblxYnVZuAepj/AEq4NVqQemcNz0z/AHtyP86H/wBFKnOrnS9d+9n/APTXnXL+W3UuqXtwATJlT+Ejoe9V14K6pH6p8R+A9PpV3G69cy8ry5vXL8npl3ntwE/rru5xFjH/ANGufn1zH659v8Fn/wDAV5lx5LXXbzKSzHTORJmPpXcVxDliQzAzsC2MDan7pFnprc9fbxWJnfRb2+hFP4fm7MWBeQq6v7tRkMvUMZ9q8y8Ym0pLmZO5M7tBz6RRb4cvsf0jzk//AOdyJJOQUz6UlVgzYDn1yY8QfWz/ACvVNY5zcZkAZWJxHhQSZMQfF8o277H6eacHxNwuB4jGZ6nsTRbk3xG9m3blBc1EksYDwGhgrQYlcdYzSnt7qCzZcUOKDtpu3YmYVCyg9QCTmD2xS1mbnFXDlFv2sZQ3SM9CJGxXT0H5V1edkfNj0CPDcZqhtQllIIIBBx0kRGOkbHsaGXODuXroLWgQGH6weVgB8oV9oM7A7jEUasfC/GWyJsMdA/CVc6gD/hLbZxHp7UuL4x7Zi5bKk5KsG1H0IOY/l0rpUWn7u4NkFzhBakJEsfMxk+U/tNvv29JMyX2wixahdV3TpJbyj5iSxB29uhNVFtNcJ82gAZYgkDaQYPp36wBTE4C272itwG2cN0bHZSTOP62qEqdtlKh3H8ju3m18PdV3t48OCnTBQEkGQFMdvtVBOFIGm8XVpgkCTq6dvN6+o7TRP9ASxcRWZ1tnPihdRZgTEEHSkTPmMwogNWs/StbIhbxl0mZ0wTjQ8MDpGrAgHMxuKqUmkBhuH5Ved0uNblkIYu3yssgDUGEEwZEkfYQZ+Z8Q15HBTQoOldKkKAJ3HYZiAd+vQ5zWbYBAGdxIOgmMLKqx7AkHfJBJnNX+IMoDMTMHIgZjGw23pZm2AT4TgrelLcK0qHaZiWVcqhXtOQRvGYMQ885DwtrMEeJMC2kBSSIjXc049xicA1HwvMlCFizoRp+QeVV2zOdgYG013xFzyw1pClqNODcadV0NlWgGRsdxGT7VUVLtHRjuP4U27keYDBGoDVDAESAT0I606xwrXDghVUSzudKqCcaj7jAEk9AakvcXbeG0gGQW28xkEmfUTRflKWrt4FbZhPMTKFjA6K5jqMmRg1o3SE4ol5ZynhGAOm6VkDxG1SxMZW0kaFP7TkxtM0Y4vlScNZIkqDcDDQpZrqLOldS+YSdJ0knTHUwxs8Zx1u3bNqzmInO2xgMxlpzuM94FRcJxFy4QTpZYkqyiSoIOCxAAJA37emOfO2+4CkeYXBcQ3B1DMoBADGZ0zt1zVxOdXnvMySZUh0Vj8o/Eqz2BJjufeqvOOHdeLtecAmdtOkGWIETIEEdBud9zU4q3bVmVmK3ZBkRoHQgkGcZMj/cEF/7SAttbN0r4jQMrpUCAdWAQvc7ETjcGhzfiheYeYMV1AkQZkycDYZOKFcMhMg4ExrmYI2IjI6z77YotfThEtHwLv6xINyQ4d2x8pJwBk9p6DosvMRP8Q8tdRaYrDFFGcAmBiSYb5lUkR8uaBLxPEaAq2rjaSZIQsJyei9mH9baDguKe9b1XW8UswUJphiIYiJAj8RxuXjuKKWuW3DK3TdFtGTSCP1Y0lH1JpGrWCPlYxPfFUm0yjLcG0WyTiHAyJwTn8jVTmLJcullaQczERvvJrR83uWzddWYy5GrpLANBBI6wpJjr61lb/LXg6SpRdyJ2yZkjIx0mqUswSY+1xShh5s7HMHODBH1rScp58iliirqI1MWYkGT8oJiemfy3rC8J86zuSMHrO1PRAH0lwywcrMAwY3AnMbSM1ulWhB6jxPN1uWrgAWSoODbMQRJBDScgjau53Zt3YZgU0iRCqM95UEj19q8tsXSCG2irdjmLDEuJHS5APuNNNL3my81xr1yCZ4InJCEkkkLvvv0AXp9amPL1JJR0aOhP2OScx7RFA7nFsC0k7x13EfyqexzBgQxIkZiAIJHt2/nTM9C3f4fScgAH1JPpkzuf6ijnJuDQa2Vp1WHkSJBJTH7/AOt8zc5s7w750zEgdTgeuKKfCnE6rtwbxZb6+a3QhtFDg7AtursjgSdxgyM6ZHY1ZveCVGmV0g4AmCT0ziYmqK8z8TSCoJ6RAORkSM1qeXcHw44YXrhNwAElE2UiYFzzSCMHIAz16xPEUNxU2P5Hy/iL9oXGujeBrDO0COsH7TSVqeRcXaawhS5wtpCJVCjOQDmGIuL5gZBwcgySZrq8jE4mSk1Xr/k3UY1qZfknxvd4dkDKWWfMsgMcY8uPtGcUR+Ivix75BtePpbUrK4IAVgsKUU9D13OPatVxf/8AF/C7pcNs+ylf/lgQPY1nOYfCF2xcVEuJcLAkKJQwPcEDtvmvUThzYpJg7l9y1bVTcMs+D5IKCTohYHacdcdJqxwvD2hpKpsPMWSAZEKygCBLKwIiB12MCeP4DiEuBNDK5EFfmcFpiFjB0w2IqlcAtA7k+GSDAkkxBPUDJMx5o7GueUU5bmdGws2rITRpUC62V6sTgSFAKwWnMHIxiRDc4XiELQbYIEKdLOsCRrDEgKZK7TscdspyZbiw3hgx5mkYAOO0bmMb9Y3oldvOGRwGWFMBcZOCdzIADeXGY3qdFzGaPjeBtXJN0zcMZmcwoiTEzByZwB71hfihFV4UrAAIAaQAc4jE/XrRmxxTH9V5izMAEWSYgTAxqOkZG5jtkdx/Jzf8NbYZgCZaBpt4ESLbqx2yY6ROKcGk7bBGbdJB6SDEZOQf5/lXMpNs2zmJnbaQAJ7T02z6Ctfa5BZAifEOmNSllEkatswAMYOZ+lV+L5CVLLbBOIaZGxJYwdl8vUYiuqGNgt5Ww97dGGflydiP696v8p4PQrFXALMqgMwA6/MpG2Tk9vaTvG8ouWcOF95BGcgA7df66w2llwVWFUhtPtHr1PX19q2cYSVxZKm+ZCODK2lUOGkFixbBJJJ39gAf9hy3G8Sf8IAPUQAAd+mf5Ve5lLkwuwgxMTiYz6GoeHtqIIyxnEEemDsO/WuJlCc/ZjdsktIiBAyNJzg57ZO+Kq8JetpeW4yI6zLKy4bJOR19tqdxnEK1+1+y3mGN8EgCfbr19KZzPiVZzgiYBgHUIAXHeIG+T9aAYvNuNNxi62lVZxpAGYkmPQhp6UvDXVKliALgJ8oCkELnK/hx0mCBJ2yi8Q3hMuoZO0DVA21QOsgR6g9BUfDuChDoSVyH6KSCIAwAJ6mfaapKkIs8k4tFuwwLayukaQSW2AAkxIkE75ozxfMnDurXTiWCgkZkSpKmD7AxvnY1kuFvnUMz/wBInpt/OrvFX9LMSIMkMCIk9vUz60mh2FOcsiy+pgdQKhm1MAJAhiMdzM7DoZAzh+LMggz6yZCiNz+Lb16VMlhXQ6zq05ycBrmAdU+UA5JYGfShVsEHeRMauhgmGWckTP8ApTq0DYb5rytHQHQlswBqtwJPWBA1ZMxv98g+F5bdu3NbsGCkocwRpkYEYM579aMW+ZSmhoKn0bUhETtGwC/RT9W8Re0hrwaC24GkKSAB1kBp3GM/lWG3sMH3OQaPNJgZ6fTauPw6cEOduqHr6zVtuba10l1gjrg/wq7Y5xELCkARuRt9DWvvWOo0ZLmU27hWMA7xvIBP5k1Yv8C8aokaQSZE7Tt1rVnmCQZH5g/TMVDc4m0en5T+6aq2TSMulglDAncCMkmcxHvRb4LssL9yVYfqW3BH4k71Fy6NKyfxGRtijfJrp/SSo+Q2m9QSCn86UZO2ipLRGL5cPOn+YV6FydmtcGt02QqhnK6TBu7jUzRJYwwidk9qwfDi2pDebUsHcRitFwXNAj24dkEgyM6JgatOxwfyrLisPpUkRFhH4f4i81tmtWjoLmJJboB82J7V1H+H4q6RK37jg5DLbkZ/j/OurleJFvb6jNzzXibfhstxzpKwxBYCHkacRLEA4GaynEcbruA22ZWBC+LhSY1TuAYmGj8RBwZoNxHNbaCVdH1MsBhqiDDIyKfKCSTIIOZiDVe7xyhMyDJTwyQAm5I+bV1nPVsTEVWSU3Q5zsv864i25kBFMea4hzES0swAYggEZO84oU7CyJhbwlYYk23RVBkrOdjhkkSB1MVZ4zjWe2QQX2QKpHmWWVnLTKsoIiJEnr1qDll2NSFzbtW2tuLZIKPmTIjqpic42rSNRlTJbZc5dxLXVtmbuskTb1qr3f8A2mvSHRW886ZBM96t814y1OpVYF9OgxhoLEsVUERqwBgGPrQEWQAigxLAL5QIyDqMgac6saRtjAotyzjIvqfCBa2TMQAwUBmUScCcTt5hiRgxGnogKd/h2tFS1plkT4jGIkFlGgZVgCsg522kGrXC37zMGZQsFGJfTElmJBVQBpyD5iuQR7T874niL1u4jpatWyQZYy6sCfOzMYVdGsRGqXjBihfCcFdW3IJAIDaRb1iJHmGWIHmExselTPCjFVF2gjtqFX49bYMKxOACAIaSSdORAhT0PUGMVPw/F2zajqCJVVOo6o88qVESxMGMiIrP8AV1hWXBMasEFm8sXJPXUCTn5xjFGPAKw2ksAFUGCWuAD9WVyQVADbRAQGQcVnlikkMIWeIUatQZ/MY8wVWTywDiJk5jrp6CqF/k1t21BikSCcEAfKwLQPlkLPWdqtNxWsFyQuNM6yGUNO1v2DT7jpVlrj3bRKR5SuktOlysysgCDIMYwCRNRGco7aCM/e5LfggaBLEAahIAJknEgELv+yO1Z/il8NtJWCcdsbiJ/wBelbx7p1xrJYs+oTJyFEaQNIJ3DD65GIeM5YbqutzQLYUmdK6gMqpYrhTE4GJHStY4rvVBRik5TduabqqulTAGoBjqH4VPzCcehnapbnI7jFtIGVBGcGQBExAOqRG2PYkkqNw7Ei55ElQHMuhUEjUFbcxsRjX0xU/DcXw9u0HxNzZFdzBUCCVOxEkZMjVM5kaZm1oBmGsMguBgVIGlRpJD5gwdtpM52qtaugIQQTPSe43n+t6Mc1Rrjq6XA0QoV5BVe2CxmSTGT5h3qzxNtGGi1bAYRGdLNHzTJOogEH8PTHQaKmtRGdscT5wYGDO09RO2+Kk464S0sdvoBHQYwOn0oinJ1/G+hj+HTgjoQxIGYOc/uqDmfK2S3qDKV1ESCJkGPlJk7dsSKTVsBnCcSIIz8m/sT6Hcde5PeKpXUZP1ZBAnUJHf2Pt12967hrpXoexgxuIwYOcTTr7uwRSSdIGkE7YE/mJ95pqLGWAAtwg94MER98jvRi+EZFttJIBlflGc7IJgx65OYihHDnUZJ805mTJ6mesmTV03IjqQI7iMkxn+GPtVrCsWagVc4JNQCwCRtqOdttQwII3J7139nMM6W9wJ/MVPzZQeIQW7gjSGgwCAfnUn8WVPfcR1qx4Y3rZYdorPXIF3rTdGIjvIqDTc7/mKNlm/xH6mR9jUTA9Qp/6QP/GKOjYZ4spW7jDHpRb4UuM3Ef8AQfXqtUWtjqv2J/jNFvhRB+kdflO8d161OWSHcWY8GMVYsvBDCJEGCJBjuD09KutwoJgFd+xH8KK8k+G2vB7i6CEIAUkkXCZlQFk4AJ+3uIm8quQZVyYR4XiePKKVRwCARoR9MHII0Y2NdWk4S7xIGcSZ0i3fIWQPKPLH2kZ3rq8t47vZfMKRleR8C/6xgwV0HlBMTJgKp/xS0jBmD1iI04Pw0/WKAJKjKg6lGWTEZiP2piR5YI3pfPD2wPLpueEw8zNiXc/LjyAnt1mnWOLuairIbaYU9VYCG382o+RjjUd66c048iRPh7wxctvDNBQOSPDA1MxA0ggwBAnbfoRWv47m2tHtqPEkBTCjyqpZyNIXACmPcY61jOPvW2DOfGcp+rY6VUQNTAvjSJBYAA4AMk4FI/EgE22s3dZloVZIGhdGANTggMSciADAmac1J7OgHXiiujXkcqNaqqkDIYqASoifNvPUZ6UyzzIEH9YsgYCxlsDU0CCgUZ0rJgnfarxvG+GWtfMbqrK2rikySCVfy4ecFfNH2NWOXcIVua1utbGhnKjSWyIgspjQWI3zvAOaqOE3HUO4NvaU221sCWKwfM1sSCRCrl1MTMCNsZnuMAZnGhW80afNq0PClMEYnSTv+VB3402l8KQMKQDLlVBJEIGgALqJBAMloz5aC855zqRQpcsdQuOzf3oaARpk6R0A2AA7VksLvGmkFbvF3PF0tkyQAVI1KcE6hPlIY/LOT03rUcefIdQyohRuNTdztBDAgmB58zJrzngSJ8gDFWOlWOQCDvEAwYMkxiCIrRc8ZtNu1YZySFUhQNUHUugFZkmT1/CetaPDT3DkW7XMbZJfSLZIhtS7MPm0gsAw8pkGIOflBBl5dxtrxCsgQQ0yRKjJ0uRJJ2nt9SM7aW4rgwyS5zOdOsoVEwJDSvT2ozzpTw5uLoVSNL+dU3ujxGCNrIPnRxCiYkkkYB0a2Ah5ncvFpFlgCVZXUyjaixhjAFuBjSB9Ygl1vmwQJaa7qyWUIowCRuQJJldztExmo73HRbWwzW01aW0E5VUYNbBIHSZ9oGcgAuM4IWmCghpJCnpnbLY2YDfcVp0aYi5xltnD3PmJYBAFzBDQYadAOTAyY9iYuG4O86ojAqA4BkFQuoBstJ6BdwI1VXtcLfhQq3DIlVyQy9fKM6SN6tcbztisFCdOCWJIYSYzuNoiSI7kSdYxQNBn9GHD2cgXQwJUEKIEEnURknUrdx7ECa/C8ytKqAtEg6o0gFcg/KJLAEnbpEgianXjbN+0TpbxFt5OqCqgKpJ07ksAZjttmA9vgSzECWENpaA6gA/sD5SSBkCO3YnGN6Cjdalq4zOVW0pctOwLRuY1BRjcbnYyRuCz8rUp4ZulTqJhSTIAIYQBggwsesZIzmeG42/aL+GGkifLMCSAGwIA7SMGn8s5/dZgLrhTIzBHoCWAkgapyenUxWbg90NFbmvJr9qSwzIBKzEA9WMBcsBG5k4waiuXUAUzB26/meu5B9utL8Rcdd1Mj+YREsoVszpJUEgEAsAd85zsBtgZzEZjvtWsb5gwp4+RpOIme0TvVzheO1GG379IAnv2oOHAgmIj65/3qZ00ttgjByD9R06iKalTEo2FLlgi8tyDgZ+ziMd9eavAwYEH6A1HwBZmC4Pl7xtjqd6IXLMboQO5Bj71vFp7Ckmtymyz0H0n+JqI2qvDTSMoqiSgbdF/hq0RfB/Z6EHqvaqbKKvfD7AXgfT+K0pbDW4IQBbgLLIDSRJWfqsEe4rW2OavxCAC8toKT5dbtd0AzGloVxBJmR8pmsvcSSfetDy7lD2kZzqF1vIiJJcGQSDGBtJ9B644+LjDKnJ68iosZd5nxNpig13RM61VgrSATEqesiuqLiOM4uxptatBCiVScSPxY+aInJk5mlrkWHNrqx83+C9CDj3I4ewASBqfr2FmPtQ3jOMuNw6hrjsBeIALEwJOBJwMD7V1dXQxMuXbS+BwpgZdZwM/Lv3qPiWI4i5BIi+APSFxH2H2rq6sVv5/UQPiLtgj/CW+up8++Bn0FLzERYSMSXJjqVuKqn3AJA7Amlrq6IdUQjXDoOT5VEZ2xb27bn7mgvF7z1hPzXNdXVPr5jYXZiht6DplLc6cTqImY79avK5JySdNgss/hZRb0kdiOh6UldQyiTnzE3ZJkwmT/ltH95P3q3zG4X47Q5LKtu1pVjKrJtzpBwPpXV1D2Eylz8YX0BA9BIED6VR4rKW5z5Tv6DH2rq6nHYQURB+rMCZP5i5/Ifag3BMTdtzmQxM5khWgn7D7Curq1W4M1/MeCtG0xNtCYJyo3BgHbsT96iQRwFsjBIYE9wRaJB7iWY/9R711dS4ndEYewnKc8NnMvBnMgrdYg9wSoPuBWQvDzn0Y/vpK6s49ZnRDmU+NMxPTyj0UbAdh6Uf5dYTQ/lX+6udB0kj866urpwzLEMyBkjpoNXLxyfTSB6AbCkrqn9qNH1mFeUH9Yf8AL/E1p7BxP9dK6uqobESJr9lTbLFQTG5An71mQa6urVGbFJqxy35/p/EV1dRLZgtyudz71q/hZzoOTt/4qmn7dK6uri47/F8RrcGfEN1heYAmBMCdstXV1dXnIbP/2Q=='
                alt='Ký túc xá 2'
              />
              <div className='gallery-caption'>
                <h3>Khuôn viên xanh mát</h3>
                <p>Khuôn viên nhiều cây xanh, không khí trong lành, thư giãn.</p>
              </div>
            </div>
            <div className='gallery-block left-slide'>
              <img
                src='data:image/jpeg;base64,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'
                alt='Ký túc xá 3'
              />
              <div className='gallery-caption'>
                <h3>Khu vực thể thao</h3>
                <p>Sân bóng, phòng gym phục vụ nhu cầu rèn luyện sức khỏe.</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className='student-dashboard-footer'>
            <div className='footer-content'>
              <div className='footer-info'>
                <strong>Ký túc xá UTT</strong> &copy; {new Date().getFullYear()}
                <br />
                Địa chỉ: Số 1, phố X, quận Y, Hà Nội
                <br />
                Hotline: <a href='tel:0123456789'>0123 456 789</a> | Email:{' '}
                <a href='mailto:ktx@utt.edu.vn'>ktx@utt.edu.vn</a>
              </div>
              <div className='footer-social'>
                <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
                  Facebook
                </a>{' '}
                |
                <a href='https://zalo.me' target='_blank' rel='noopener noreferrer'>
                  Zalo
                </a>{' '}
                |
                <a href='https://utt.edu.vn' target='_blank' rel='noopener noreferrer'>
                  Website
                </a>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  )
}

export default AdminDashboardScreen
